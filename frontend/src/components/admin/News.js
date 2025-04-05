import React, { useEffect, useState, useRef } from "react";
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
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "../../styles/draggable.css";

const { Column, HeaderCell, Cell } = Table;
const ItemTypes = { ROW: "row" };

function DraggableRow({ children, rowData, onDrag }) {
  const ref = useRef(null);
  const hasDroppedRef = useRef(false);

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.ROW,
      item: { id: rowData.documentId },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [rowData.documentId]
  );

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.ROW,
      drop: (item) => {
        if (!hasDroppedRef.current) {
          onDrag?.(item.id, rowData.documentId);
          hasDroppedRef.current = true;
          setTimeout(() => {
            hasDroppedRef.current = false;
          }, 200);
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [rowData.documentId]
  );

  drag(drop(ref));

  const isActive = canDrop && isOver;

  return (
    <div ref={ref} className={`draggable-row${isDragging ? " dragging" : ""}`}>
      {isActive && <div className="drop-indicator" />}
      {children}
    </div>
  );
}

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
      const res = await API.get("/news-lists?populate=image&sort=order:asc", {
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

  const updateOrder = async (newData) => {
    setNews(newData);
    try {
      await Promise.all(
        newData.map((item, index) =>
          API.put(
            `/news-lists/${item.documentId}`,
            { data: { order: index } },
            { headers: { Authorization: `Bearer ${user.jwt}` } }
          )
        )
      );
    } catch {
      setError("Не вдалося оновити порядок новин");
    }
  };

  const moveRow = (dragId, hoverId) => {
    const dragIndex = news.findIndex((i) => i.documentId === dragId);
    const hoverIndex = news.findIndex((i) => i.documentId === hoverId);
    if (dragIndex === -1 || hoverIndex === -1) return;
    const newData = [...news];
    const [dragRow] = newData.splice(dragIndex, 1);
    newData.splice(hoverIndex, 0, dragRow);
    updateOrder(newData);
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
      if (editItem?.locale && editItem?.documentId) {
        await API.put(
          `/news-lists/${editItem.documentId}?locale=${editItem.locale}`,
          payload,
          { headers: { Authorization: `Bearer ${user.jwt}` } }
        );
        setSuccess("Новину оновлено успішно");
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

      <DndProvider backend={HTML5Backend}>
        <Table
          autoHeight
          data={news}
          loading={loading}
          rowKey="documentId"
          style={{ marginTop: 20 }}
          renderRow={(children, rowData) => {
            if (!rowData) return children;
            return (
              <DraggableRow
                key={rowData.documentId}
                rowData={rowData}
                onDrag={moveRow}
              >
                {children}
              </DraggableRow>
            );
          }}
        >
          <Column width={80} align="center">
            <HeaderCell>Зображення</HeaderCell>
            <Cell>
              {(rowData) =>
                rowData.image ? (
                  <img
                    className="table-thumbnail"
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

          <Column flexGrow={2}>
            <HeaderCell>Заголовок</HeaderCell>
            <Cell dataKey="title" />
          </Column>

          <Column flexGrow={3}>
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
      </DndProvider>

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
