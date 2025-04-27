import React, { useEffect, useState } from "react";
import {
  Panel,
  Button,
  Modal,
  Form,
  Message,
  Toggle,
  Uploader,
  Table,
  List,
} from "rsuite";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axiosInstance";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DraggableTableWrapper from "../DraggableTableWrapper";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrag, useDrop } from "react-dnd";

const { Column, HeaderCell, Cell } = Table;

const News = () => {
  const { user } = useAuth();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [formValue, setFormValue] = useState({
    title: "",
    content: "",
    published: false,
    image: null,
  });

  const fetchNews = async () => {
    try {
      const res = await API.get(
        "/news-lists?populate=image&sort=order:asc&pagination[pageSize]=100",
        {
          headers: { Authorization: `Bearer ${user.jwt}` },
        }
      );
      setNews(res.data?.data || []);
    } catch (err) {
      console.error(err);
      setError("Не вдалося отримати новини");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const blocksToHtml = (blocks) => {
    if (!Array.isArray(blocks)) return blocks || "";
    return blocks
      .map(
        (block) =>
          `<p>${block.children.map((child) => child.text).join("")}</p>`
      )
      .join("");
  };

  const htmlToBlocks = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return Array.from(div.querySelectorAll("p")).map((p) => ({
      type: "paragraph",
      children: Array.from(p.childNodes).map((node) => ({
        type: "text",
        text: node.textContent,
      })),
    }));
  };

  const openModal = (item = null) => {
    setSuccess("");
    setError("");

    if (item) {
      setEditItem(item);
      const { title, content, published, image } = item;
      setFormValue({
        title: title || "",
        content: blocksToHtml(content),
        published: !!published,
        image: image || null,
      });
    } else {
      setEditItem(null);
      setFormValue({
        title: "",
        content: "",
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
        console.error("Помилка завантаження зображення", uploadErr);
        setError("Не вдалося завантажити зображення");
        return;
      }
    }

    const payload = {
      data: {
        ...formValue,
        content: htmlToBlocks(formValue.content),
        image: uploadedImage?.id || null,
      },
    };

    try {
      if (editItem?.documentId) {
        await API.put(`/news-lists/${editItem.documentId}`, payload, {
          headers: { Authorization: `Bearer ${user.jwt}` },
        });
      } else {
        await API.post("/news-lists", payload, {
          headers: { Authorization: `Bearer ${user.jwt}` },
        });
        setSuccess("Новину створено успішно");
      }
      setModalOpen(false);
      setTimeout(fetchNews, 100);
    } catch (err) {
      console.error("Помилка збереження новини", err);
      setError("Помилка при збереженні новини");
    }
  };

  const handleSortEnd = ({ oldIndex, newIndex }) => {
    setNews((prevNews) => {
      const movedItem = prevNews.splice(oldIndex, 1);
      const updatedNews = [...prevNews];
      updatedNews.splice(newIndex, 0, movedItem[0]);
      return updatedNews;
    });

    Promise.all(
      news.map((item, index) =>
        API.put(
          `/news-lists/${item.documentId}`, // Використовуємо documentId
          { data: { order: index } },
          { headers: { Authorization: `Bearer ${user.jwt}` } }
        )
      )
    ).catch(() => setError("Не вдалося оновити порядок новин"));
  };

  const moveRow = (fromIndex, toIndex) => {
    const updated = [...news];
    const [movedItem] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, movedItem);
    setNews(updated);

    Promise.all(
      updated.map((item, index) =>
        API.put(
          `/api/news-lists/${item.documentId}`, // Використовуємо documentId
          { data: { order: index } },
          { headers: { Authorization: `Bearer ${user.jwt}` } }
        )
      )
    )
      .then(() => setSuccess("Порядок новин оновлено"))
      .catch((err) => {
        console.error("Помилка оновлення порядку новин", err);
        setError("Не вдалося оновити порядок новин");
      });
  };

  const getPreviewText = (content) => {
    if (Array.isArray(content) && content.length > 0) {
      return content
        .map((block) => block.children.map((child) => child.text).join(" "))
        .join(" ")
        .slice(0, 100);
    }
    if (typeof content === "string") {
      return content.slice(0, 100);
    }
    return "—";
  };

  return (
    <Panel header="Новини" bordered>
      {error && (
        <Message className="inside-message" type="error">
          {error}
        </Message>
      )}
      {success && (
        <Message className="inside-message" type="success">
          {success}
        </Message>
      )}

      <Button appearance="primary" onClick={() => openModal()}>
        Додати новину
      </Button>

      <List sortable bordered onSort={handleSortEnd} style={{ marginTop: 20 }}>
        {news.map((rowData, index) => (
          <List.Item key={rowData.documentId} index={index}>
            {/* Використовуємо documentId як ключ */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "0 0 80px", textAlign: "center" }}>
                {rowData.image ? (
                  <img
                    src={`http://localhost:1337${rowData.image.url}`}
                    alt="thumb"
                    width="50"
                  />
                ) : (
                  "—"
                )}
              </div>
              <div style={{ flex: 2 }}>{rowData.title}</div>
              <div style={{ flex: 3 }}>{getPreviewText(rowData.content)}</div>
              <div style={{ flex: "0 0 120px", textAlign: "center" }}>
                {rowData.published ? "Так" : "Ні"}
              </div>
              <div style={{ flex: "0 0 100px", textAlign: "center" }}>
                <Button
                  size="xs"
                  appearance="link"
                  onClick={() => openModal(rowData)}
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
            {editItem ? "Редагувати новину" : "Додати новину"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid>
            {formValue.image && (
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
              <Form.ControlLabel>Заголовок</Form.ControlLabel>
              <Form.Control
                name="title"
                value={formValue.title}
                onChange={(val) =>
                  setFormValue((prev) => ({ ...prev, title: val }))
                }
              />
            </Form.Group>

            <Form.Group>
              <Form.ControlLabel>Контент</Form.ControlLabel>
              <ReactQuill
                theme="snow"
                modules={{ toolbar: false }}
                value={formValue.content || ""}
                onChange={(val) =>
                  setFormValue((prev) => ({ ...prev, content: val }))
                }
              />
            </Form.Group>

            <Form.Group>
              <Form.ControlLabel>Зображення</Form.ControlLabel>
              <Uploader
                autoUpload={false}
                onChange={(fileList) => setImageFile(fileList[0]?.blobFile)}
              />
            </Form.Group>

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

export default News;
