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
} from "rsuite";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axiosInstance";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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

  // Дані форми
  const [formValue, setFormValue] = useState({
    title: "",
    content: "",
    published: false,
    image: null, // збережене зображення (url, id тощо)
  });

  // ----------------------------------
  // 1) Завантажуємо список новин
  // ----------------------------------
  const fetchNews = async () => {
    try {
      const res = await API.get("/news-lists?populate=image", {
        headers: { Authorization: `Bearer ${user.jwt}` },
      });
      // Якщо Strapi повертає структуру без attributes
      // то кожен елемент виглядає приблизно так:
      // { id, title, content, image: { id, url }, published, locale, documentId, ... }
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

  // ----------------------------------
  // 2) Робота з Rich Text (Quill)
  // ----------------------------------
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

  // ----------------------------------
  // 3) Відкриття/закриття модалки
  // ----------------------------------
  const openModal = (item = null) => {
    setSuccess("");
    setError("");

    if (item) {
      // Редагуємо
      setEditItem(item);
      const { title, content, published, image } = item;
      setFormValue({
        title: title || "",
        content: blocksToHtml(content),
        published: !!published,
        image: image || null, // Якщо зображення є, збережемо об'єкт { id, url, ... }
      });
    } else {
      // Нова новина
      setEditItem(null);
      setFormValue({
        title: "",
        content: "",
        published: false,
        image: null,
      });
    }
    setImageFile(null); // Скидаємо файл
    setModalOpen(true);
  };

  // ----------------------------------
  // 4) Завантаження зображення на сервер
  // ----------------------------------
  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("files", file);

    const uploadRes = await API.post("/upload", formData, {
      headers: { Authorization: `Bearer ${user.jwt}` },
    });
    // Повертається масив, беремо перший об'єкт
    return uploadRes.data[0];
  };

  // ----------------------------------
  // 5) Видалити зображення (з форми)
  // ----------------------------------
  const removeImage = () => {
    setFormValue((prev) => ({ ...prev, image: null }));
  };

  // ----------------------------------
  // 6) Збереження новини
  // ----------------------------------
  const handleSubmit = async () => {
    let uploadedImage = formValue.image; // поточне зображення (може бути null)

    // Якщо користувач завантажив новий файл
    if (imageFile) {
      try {
        uploadedImage = await handleImageUpload(imageFile);
      } catch (uploadErr) {
        console.error("Помилка завантаження зображення", uploadErr);
        setError("Не вдалося завантажити зображення");
        return;
      }
    }

    // Формуємо payload для Strapi
    const payload = {
      data: {
        ...formValue,
        content: htmlToBlocks(formValue.content),
        image: uploadedImage?.id || null, // Якщо видалили, буде null
      },
    };

    try {
      // Якщо редагуємо існуючий запис із локалізацією
      if (editItem?.locale && editItem?.documentId) {
        // Оновлення
        try {
          await API.put(
            `/news-lists/${editItem.documentId}?locale=${editItem.locale}`,
            payload,
            { headers: { Authorization: `Bearer ${user.jwt}` } }
          );
          setSuccess("Новину оновлено успішно");
        } catch (err) {
          // Якщо не існує локалізації
          if (err.response?.status === 404) {
            await API.post(
              `/news-lists/${editItem.documentId}/localizations?locale=${editItem.locale}`,
              payload,
              { headers: { Authorization: `Bearer ${user.jwt}` } }
            );
            setSuccess("Локалізацію створено успішно");
          } else {
            throw err;
          }
        }
      } else {
        // Створення нової новини
        await API.post("/news-lists", payload, {
          headers: { Authorization: `Bearer ${user.jwt}` },
        });
        setSuccess("Новину створено успішно");
      }

      setModalOpen(false);
      fetchNews();
    } catch (err) {
      console.error("Помилка збереження новини", err);
      setError("Помилка при збереженні новини");
    }
  };

  // ----------------------------------
  // 7) Відображення контенту в таблиці
  // ----------------------------------
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

      {/* ----------- TABLE ------------ */}
      <Table autoHeight data={news} loading={loading} style={{ marginTop: 20 }}>
        {/* 1) Колонка зображення */}
        <Column width={80} align="center">
          <HeaderCell>Зображення</HeaderCell>
          <Cell>
            {(rowData) =>
              rowData.image ? (
                <img
                  src={`http://localhost:1337${rowData.image.url}`}
                  alt="thumb"
                  width="50"
                />
              ) : (
                "—"
              )
            }
          </Cell>
        </Column>

        {/* 2) Заголовок */}
        <Column flexGrow={2}>
          <HeaderCell>Заголовок</HeaderCell>
          <Cell dataKey="title" />
        </Column>

        {/* 3) Контент (короткий прев'ю) */}
        <Column flexGrow={3}>
          <HeaderCell>Контент</HeaderCell>
          <Cell>{(rowData) => getPreviewText(rowData.content)}</Cell>
        </Column>

        {/* 4) Опубліковано */}
        <Column width={120} align="center">
          <HeaderCell>Опубліковано</HeaderCell>
          <Cell>{(rowData) => (rowData.published ? "Так" : "Ні")}</Cell>
        </Column>

        {/* 5) Дії */}
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

      {/* ----------- MODAL ------------ */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} size="md">
        <Modal.Header>
          <Modal.Title>
            {editItem ? "Редагувати новину" : "Додати новину"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid>
            {/* Якщо вже є зображення, показуємо прев'ю + кнопка Видалити */}
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

            {/* Заголовок */}
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

            {/* Контент (ReactQuill, без тулбара) */}
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

            {/* Завантаження нового зображення */}
            <Form.Group>
              <Form.ControlLabel>Зображення</Form.ControlLabel>
              <Uploader
                autoUpload={false}
                onChange={(fileList) => setImageFile(fileList[0]?.blobFile)}
              />
            </Form.Group>

            {/* Опубліковано */}
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
