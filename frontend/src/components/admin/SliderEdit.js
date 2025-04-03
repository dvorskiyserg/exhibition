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
} from "rsuite";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axiosInstance";

const type = "row";

const DraggableRow = ({ slide, index, moveRow, onEdit }) => {
  const ref = React.useRef(null);

  const [, drop] = useDrop({
    accept: type,
    hover(item) {
      if (item.index === index) return;
      moveRow(item.index, index);
      item.index = index;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: 10,
        borderBottom: "1px solid #eee",
        background: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span>{slide.title}</span>
      <Button size="xs" appearance="link" onClick={() => onEdit(slide)}>
        Редагувати
      </Button>
    </div>
  );
};

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
      const res = await API.get("/slider-items?populate=image&sort=order:asc", {
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

  const moveRow = (fromIndex, toIndex) => {
    const updated = [...slides];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setSlides(updated);
  };

  const saveOrder = async () => {
    try {
      await Promise.all(
        slides.map((slide, index) =>
          API.put(
            `/slider-items/${slide.id}`,
            { data: { order: index } },
            { headers: { Authorization: `Bearer ${user.jwt}` } }
          )
        )
      );
      setSuccess("Порядок оновлено успішно");
    } catch (err) {
      setError("Не вдалося оновити порядок");
    }
  };

  const openModal = (item = null) => {
    setSuccess("");
    setError("");
    if (item) {
      const { type, title, videoUrl, videoEmbed, published, image } = item;
      setEditSlide(item);
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

    const baseData = {
      ...formValue,
      videoEmbed: formValue.videoEmbed || undefined,
      videoUrl: formValue.videoUrl || undefined,
      image:
        formValue.type === "image" && uploadedImage?.id
          ? uploadedImage.id
          : null,
    };

    Object.keys(baseData).forEach((key) => {
      if (baseData[key] === undefined) {
        delete baseData[key];
      }
    });

    const payload = { data: baseData };

    try {
      if (editSlide && editSlide.id) {
        await API.put(`/slider-items/${editSlide.id}`, payload, {
          headers: { Authorization: `Bearer ${user.jwt}` },
        });
        setSuccess("Слайд оновлено успішно");
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
      <Button onClick={saveOrder} appearance="ghost" style={{ marginLeft: 10 }}>
        Зберегти порядок
      </Button>

      <DndProvider backend={HTML5Backend}>
        <div style={{ marginTop: 20 }}>
          {slides.map((slide, index) => (
            <DraggableRow
              key={slide.id}
              index={index}
              slide={slide}
              moveRow={moveRow}
              onEdit={openModal}
            />
          ))}
        </div>
      </DndProvider>

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
