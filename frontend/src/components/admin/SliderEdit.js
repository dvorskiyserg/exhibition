import React, { useEffect, useState } from "react";
import {
  Panel,
  Button,
  Table,
  Modal,
  Form,
  Message,
  Toggle,
  Uploader,
  SelectPicker,
} from "rsuite";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axiosInstance";

const { Column, HeaderCell, Cell } = Table;

const SliderEdit = () => {
  const { user } = useAuth();
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editSlide, setEditSlide] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [formValue, setFormValue] = useState({
    type: "image",
    title: "",
    videoUrl: "",
    videoEmbed: "",
    published: false,
    image: null,
  });

  const fetchSlides = async () => {
    try {
      const res = await API.get("/slider-items?populate=image", {
        headers: { Authorization: `Bearer ${user.jwt}` },
      });
      setSlides(res.data?.data || []);
    } catch (err) {
      setError("Не вдалося отримати слайди");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const openModal = (item = null) => {
    setSuccess("");
    setError("");
    if (item) {
      setEditSlide(item);
      const { type, title, videoUrl, videoEmbed, published, image } = item;
      setFormValue({
        type: type || "image",
        title: title || "",
        videoUrl: videoUrl || "",
        videoEmbed: videoEmbed || "",
        published: !!published,
        image: image || null,
      });
    } else {
      setEditSlide(null);
      setFormValue({
        type: "image",
        title: "",
        videoUrl: "",
        videoEmbed: "",
        published: false,
        image: null,
      });
    }
    setImageFile(null);
    setModalOpen(true);
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("files", file);
    const uploadRes = await API.post("/upload", formData, {
      headers: { Authorization: `Bearer ${user.jwt}` },
    });
    return uploadRes.data[0];
  };

  const removeImage = () => {
    setFormValue((prev) => ({ ...prev, image: null }));
  };

  const handleSubmit = async () => {
    let uploadedImage = formValue.image;
    if (imageFile) {
      try {
        uploadedImage = await handleImageUpload(imageFile);
      } catch (uploadErr) {
        setError("Не вдалося завантажити зображення");
        return;
      }
    }

    const payload = {
      data: {
        ...formValue,
        image: formValue.type === "image" ? uploadedImage?.id || null : null,
      },
    };

    try {
      if (editSlide && editSlide.locale && editSlide.documentId) {
        try {
          await API.put(
            `/slider-items/${editSlide.documentId}?locale=${editSlide.locale}`,
            payload,
            { headers: { Authorization: `Bearer ${user.jwt}` } }
          );
          setSuccess("Слайд оновлено успішно");
        } catch (err) {
          if (err.response?.status === 404) {
            await API.post(
              `/slider-items/${editSlide.documentId}/localizations?locale=${editSlide.locale}`,
              payload,
              { headers: { Authorization: `Bearer ${user.jwt}` } }
            );
            setSuccess("Локалізацію створено успішно");
          } else {
            throw err;
          }
        }
      } else {
        await API.post("/slider-items", payload, {
          headers: { Authorization: `Bearer ${user.jwt}` },
        });
        setSuccess("Слайд створено успішно");
      }
      setModalOpen(false);
      fetchSlides();
    } catch (err) {
      setError("Помилка при збереженні слайда");
    }
  };

  const getTypeLabel = (type) => (type === "image" ? "Зображення" : "Відео");

  return (
    <Panel header="Редагування слайдів" bordered>
      {error && <Message type="error">{error}</Message>}
      {success && <Message type="success">{success}</Message>}

      <Button
        appearance="primary"
        onClick={() => openModal()}
        style={{ marginBottom: 15 }}
      >
        Додати слайд
      </Button>

      <Table
        autoHeight
        data={slides}
        loading={loading}
        style={{ marginTop: 20 }}
      >
        <Column width={80} align="center">
          <HeaderCell>Тип</HeaderCell>
          <Cell>{(rowData) => getTypeLabel(rowData.type)}</Cell>
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Заголовок</HeaderCell>
          <Cell dataKey="title" />
        </Column>
        <Column width={120} align="center">
          <HeaderCell>Опубліковано</HeaderCell>
          <Cell>{(rowData) => (rowData.published ? "Так" : "Ні")}</Cell>
        </Column>
        <Column width={100} align="center">
          <HeaderCell>Дії</HeaderCell>
          <Cell>
            {(rowData) => (
              <Button
                size="xs"
                appearance="link"
                onClick={() => openModal(rowData)}
              >
                Редагувати
              </Button>
            )}
          </Cell>
        </Column>
      </Table>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} size="md">
        <Modal.Header>
          <Modal.Title>
            {editSlide ? "Редагувати слайд" : "Додати слайд"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid>
            {formValue.type === "image" && formValue.image && (
              <div style={{ marginBottom: 15 }}>
                <img
                  src={`http://localhost:1337${formValue.image.url}`}
                  alt="Current"
                  style={{
                    width: "100%",
                    maxHeight: 200,
                    objectFit: "contain",
                  }}
                />
                <Button
                  color="red"
                  appearance="ghost"
                  onClick={removeImage}
                  style={{ marginTop: 10 }}
                >
                  Видалити зображення
                </Button>
              </div>
            )}
            <Form.Group>
              <Form.ControlLabel>Тип слайду</Form.ControlLabel>
              <Form.Control
                name="type"
                accepter={SelectPicker}
                searchable={false}
                data={[
                  { label: "Зображення", value: "image" },
                  { label: "Відео", value: "video" },
                ]}
                value={formValue.type}
                onChange={(val) =>
                  setFormValue((prev) => ({ ...prev, type: val }))
                }
                block
              />
            </Form.Group>

            <Form.Group>
              <Form.ControlLabel>Заголовок</Form.ControlLabel>
              <Form.Control
                name="title"
                value={formValue.title}
                onChange={(val) =>
                  setFormValue((prev) => ({ ...prev, title: val }))
                }
              />
            </Form.Group>
            {formValue.type === "video" && (
              <>
                <Form.Group>
                  <Form.ControlLabel>URL відео (YouTube)</Form.ControlLabel>
                  <Form.Control
                    name="videoUrl"
                    value={formValue.videoUrl}
                    onChange={(val) =>
                      setFormValue((prev) => ({ ...prev, videoUrl: val }))
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.ControlLabel>
                    Код для вставки (iframe embed)
                  </Form.ControlLabel>
                  <Form.Control
                    name="videoEmbed"
                    accepter="textarea"
                    rows={4}
                    value={formValue.videoEmbed}
                    onChange={(val) =>
                      setFormValue((prev) => ({ ...prev, videoEmbed: val }))
                    }
                  />
                </Form.Group>
              </>
            )}
            {formValue.type === "image" && (
              <Form.Group>
                <Form.ControlLabel>
                  Завантажити нове зображення
                </Form.ControlLabel>
                <Uploader
                  action="#"
                  autoUpload={false}
                  onChange={(fileList) => setImageFile(fileList[0]?.blobFile)}
                />
              </Form.Group>
            )}
            <Form.Group>
              <Form.ControlLabel>Опубліковано</Form.ControlLabel>
              <Toggle
                checked={formValue.published}
                onChange={(val) =>
                  setFormValue((prev) => ({ ...prev, published: val }))
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit} appearance="primary">
            Зберегти
          </Button>
          <Button onClick={() => setModalOpen(false)} appearance="subtle">
            Скасувати
          </Button>
        </Modal.Footer>
      </Modal>
    </Panel>
  );
};

export default SliderEdit;
