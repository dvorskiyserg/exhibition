import React, { useEffect, useState } from "react";
import {
  Panel,
  Button,
  Modal,
  Form,
  Message,
  Toggle,
  Uploader,
  SelectPicker,
  Input,
  List,
  IconButton,
} from "rsuite";
import { Trash } from "@rsuite/icons";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axiosInstance";
import "../../styles/draggable.css";

const SliderEdit = () => {
  const { user } = useAuth();
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editSlide, setEditSlide] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
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
      const res = await API.get("/slider-items?populate=image&sort=order:asc", {
        headers: { Authorization: `Bearer ${user.jwt}` },
      });
      const data = res.data?.data || [];
      setSlides(data);
    } catch {
      setError("Не вдалося отримати слайди");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const updateOrder = async (newData) => {
    setSlides(newData);
    try {
      await Promise.all(
        newData.map((slide, index) =>
          API.put(
            `/slider-items/documentId/${slide.documentId}`,
            { data: { order: index } },
            { headers: { Authorization: `Bearer ${user.jwt}` } }
          )
        )
      );
    } catch {
      setError("Не вдалося оновити порядок");
    }
  };

  const handleSortEnd = ({ oldIndex, newIndex }) => {
    setSlides((prevSlides) => {
      const movedItem = prevSlides.splice(oldIndex, 1);
      const updatedSlides = [...prevSlides];
      updatedSlides.splice(newIndex, 0, movedItem[0]);
      updateOrder(updatedSlides);
      return updatedSlides;
    });
  };

  const openModal = (item = null) => {
    setSuccess("");
    setError("");
    setPreviewUrl(null);
    if (item) {
      setEditSlide(item);
      setFormValue({
        type: item.type || "image",
        title: item.title || "",
        videoUrl: item.videoUrl || "",
        videoEmbed: item.videoEmbed || "",
        published: !!item.published,
        image: item.image || null,
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

  const handleSubmit = async () => {
    let uploadedImage = formValue.image;
    if (imageFile) {
      try {
        uploadedImage = await handleImageUpload(imageFile);
      } catch {
        setError("Не вдалося завантажити зображення");
        return;
      }
    }

    const payload = {
      data: {
        ...formValue,
        image: uploadedImage?.id || null,
      },
    };

    try {
      if (editSlide?.documentId) {
        await API.put(
          `/slider-items/documentId/${editSlide.documentId}`,
          payload,
          {
            headers: { Authorization: `Bearer ${user.jwt}` },
          }
        );
        setSuccess("Слайд оновлено успішно");
      } else {
        await API.post("/slider-items", payload, {
          headers: { Authorization: `Bearer ${user.jwt}` },
        });
        setSuccess("Слайд створено успішно");
      }
      setModalOpen(false);
      fetchSlides();
    } catch {
      setError("Помилка при збереженні слайда");
    }
  };

  const handleDelete = async (slide) => {
    try {
      await API.delete(`/slider-items/${slide.documentId}`, {
        headers: { Authorization: `Bearer ${user.jwt}` },
      });
      fetchSlides();
    } catch {
      setError("Не вдалося видалити слайд");
    }
  };

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

      <List sortable bordered onSort={handleSortEnd} style={{ marginTop: 20 }}>
        {slides.map((slide, index) => (
          <List.Item key={slide.documentId} index={index}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "0 0 120px", textAlign: "center" }}>
                {slide.image ? (
                  <img
                    className="table-thumbnail"
                    src={`http://localhost:1337${slide.image.url}`}
                    alt=""
                    style={{ height: 40 }}
                  />
                ) : (
                  "-"
                )}
              </div>
              <div style={{ flex: 2 }}>{slide.title}</div>
              <div style={{ flex: "0 0 150px", textAlign: "center" }}>
                {slide.published ? "Так" : "Ні"}
              </div>
              <div style={{ flex: "0 0 100px", textAlign: "center" }}>
                <IconButton
                  className="trash-icon"
                  icon={<Trash />}
                  color="red"
                  appearance="subtle"
                  onClick={() => handleDelete(slide)}
                />
              </div>
              <div style={{ flex: "0 0 100px", textAlign: "center" }}>
                <Button
                  size="xs"
                  appearance="link"
                  onClick={() => openModal(slide)}
                >
                  Редагувати
                </Button>
              </div>
            </div>
          </List.Item>
        ))}
      </List>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} size="md">
        <Modal.Header>
          <Modal.Title>
            {editSlide ? "Редагувати слайд" : "Додати слайд"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid>
            {formValue.type === "image" && (formValue.image || previewUrl) && (
              <div style={{ marginBottom: 15 }}>
                <img
                  src={
                    previewUrl || `http://localhost:1337${formValue.image?.url}`
                  }
                  alt="Preview"
                  style={{
                    width: "100%",
                    maxHeight: 200,
                    objectFit: "contain",
                  }}
                />
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
                  { label: "iframe", value: "iframe" },
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
            )}

            {formValue.type === "iframe" && (
              <Form.Group>
                <Form.ControlLabel>Embed-код (iframe)</Form.ControlLabel>
                <Input
                  as="textarea"
                  rows={5}
                  value={formValue.videoEmbed}
                  onChange={(val) =>
                    setFormValue((prev) => ({ ...prev, videoEmbed: val }))
                  }
                />
              </Form.Group>
            )}

            {formValue.type === "image" && (
              <Form.Group>
                <Form.ControlLabel>Завантажити зображення</Form.ControlLabel>
                <Uploader
                  action="#"
                  autoUpload={false}
                  fileListVisible={false}
                  onChange={(fileList) => {
                    const file = fileList[0]?.blobFile;
                    if (file) {
                      setImageFile(file);
                      setPreviewUrl(URL.createObjectURL(file));
                    }
                  }}
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
