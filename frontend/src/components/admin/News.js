// src/components/admin/News.js
import React, { useEffect, useState } from "react";
import { Table, Button, Message, Modal, Form, Input } from "rsuite";
import axios from "axios";

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formValue, setFormValue] = useState({ title: "", content: "" });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get("http://localhost:1337/api/news", {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      });
      setNews(response.data);
    } catch (err) {
      setError("Не вдалося отримати новини");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNews = async () => {
    try {
      await axios.post("http://localhost:1337/api/news", formValue, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      });
      setShowModal(false);
      fetchNews();
    } catch (err) {
      setError("Не вдалося додати новину");
    }
  };

  return (
    <div>
      <h2>Новини</h2>
      {error && <Message type="error">{error}</Message>}
      <Button appearance="primary" onClick={() => setShowModal(true)}>
        Додати новину
      </Button>
      <Table autoHeight data={news} loading={loading}>
        <Table.Column width={200}>
          <Table.HeaderCell>Заголовок</Table.HeaderCell>
          <Table.Cell dataKey="title" />
        </Table.Column>
        <Table.Column width={400}>
          <Table.HeaderCell>Контент</Table.HeaderCell>
          <Table.Cell dataKey="content" />
        </Table.Column>
      </Table>

      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>
          <Modal.Title>Додати новину</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid onChange={setFormValue} formValue={formValue}>
            <Form.Group>
              <Form.ControlLabel>Заголовок</Form.ControlLabel>
              <Form.Control name="title" />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Контент</Form.ControlLabel>
              <Form.Control name="content" as="textarea" rows={5} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleAddNews} appearance="primary">
            Зберегти
          </Button>
          <Button onClick={() => setShowModal(false)} appearance="subtle">
            Скасувати
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default News;
