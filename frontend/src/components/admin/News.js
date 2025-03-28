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
  const [imageFile, setImageFile] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [formValue, setFormValue] = useState({
    title: "",
    content: "",
    published: false,
  });

  const fetchNews = async () => {
    try {
      const res = await API.get("/news-lists?populate=image", {
        headers: { Authorization: `Bearer ${user.jwt}` },
      });
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
      const { title, content, published } = item;
      setFormValue({
        title: title || "",
        content: blocksToHtml(content),
        published: !!published,
      });
    } else {
      setEditItem(null);
      setFormValue({ title: "", content: "", published: false });
    }
    setImageFile(null);
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const payload = {
      data: {
        ...formValue,
        content: htmlToBlocks(formValue.content),
      },
    };

    try {
      if (editItem && editItem.locale && editItem.documentId) {
        try {
          await API.put(
            `/news-lists/${editItem.documentId}?locale=${editItem.locale}`,
            payload,
            { headers: { Authorization: `Bearer ${user.jwt}` } }
          );
          setSuccess("Новину оновлено успішно");
        } catch (err) {
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
      {error && <Message type="error">{error}</Message>}
      {success && <Message type="success">{success}</Message>}

      <Button appearance="primary" onClick={() => openModal()}>
        Додати новину
      </Button>

      <Table autoHeight data={news} loading={loading} style={{ marginTop: 20 }}>
        <Column flexGrow={2}>
          <HeaderCell>Заголовок</HeaderCell>
          <Cell dataKey="title" />
        </Column>
        <Column flexGrow={4}>
          <HeaderCell>Контент</HeaderCell>
          <Cell>{(rowData) => getPreviewText(rowData.content)}</Cell>
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
            {editItem ? "Редагувати новину" : "Додати новину"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid>
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
