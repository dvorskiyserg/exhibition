import React, { useEffect, useState } from "react";
import { Panel, Button, Table, Modal, Form, Message, Toggle } from "rsuite";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axiosInstance";

const { Column, HeaderCell, Cell } = Table;

const News = () => {
  const { user } = useAuth();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
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

  const openModal = (item = null) => {
    if (item) {
      setEditItem(item);
      const { title, content, published } = item.attributes || {};
      setFormValue({
        title: title || "",
        content: content || "",
        published: !!published,
      });
    } else {
      setEditItem(null);
      setFormValue({ title: "", content: "", published: false });
    }
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const payload = { data: formValue };
    try {
      if (editItem) {
        await API.put(`/news-lists/${editItem.id}`, payload, {
          headers: { Authorization: `Bearer ${user.jwt}` },
        });
      } else {
        await API.post("/news-lists", payload, {
          headers: { Authorization: `Bearer ${user.jwt}` },
        });
      }

      setModalOpen(false);
      fetchNews();
    } catch (err) {
      console.error("Помилка збереження новини", err);
      setError("Помилка при збереженні новини");
    }
  };

  return (
    <Panel header="Новини" bordered>
      {error && <Message type="error">{error}</Message>}

      <Button appearance="primary" onClick={() => openModal()}>
        Додати новину
      </Button>

      <Table autoHeight data={news} loading={loading} style={{ marginTop: 20 }}>
        <Column flexGrow={2}>
          <HeaderCell>Заголовок</HeaderCell>
          <Cell>{(rowData) => rowData?.attributes?.title || "—"}</Cell>
        </Column>
        <Column flexGrow={4}>
          <HeaderCell>Контент</HeaderCell>
          <Cell>{(rowData) => rowData?.attributes?.content || "—"}</Cell>
        </Column>
        <Column width={120} align="center">
          <HeaderCell>Опубліковано</HeaderCell>
          <Cell>
            {(rowData) => (rowData?.attributes?.published ? "Так" : "Ні")}
          </Cell>
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
          <Form fluid formValue={formValue} onChange={setFormValue}>
            <Form.Group>
              <Form.ControlLabel>Заголовок</Form.ControlLabel>
              <Form.Control name="title" />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Контент</Form.ControlLabel>
              <Form.Control name="content" rows={5} />
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
