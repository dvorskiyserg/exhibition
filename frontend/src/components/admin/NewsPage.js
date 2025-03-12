import React, { useState } from "react";
import AppLayout from "./AppLayout";
import { Button, Table, Modal, Form } from "rsuite";

const { Column, HeaderCell, Cell } = Table;

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formValue, setFormValue] = useState({});

  const handleSave = () => {
    // Логіка збереження (POST / PUT до Strapi)
    setShowModal(false);
  };

  return (
    <AppLayout>
      <h4>Новини</h4>
      <Button appearance="primary" onClick={() => setShowModal(true)}>
        Додати новину
      </Button>
      <Table data={news} autoHeight bordered>
        <Column width={300}>
          <HeaderCell>Заголовок</HeaderCell>
          <Cell dataKey="title" />
        </Column>
        <Column width={500}>
          <HeaderCell>Опис</HeaderCell>
          <Cell dataKey="description" />
        </Column>
        <Column width={100}>
          <HeaderCell>Дії</HeaderCell>
          <Cell>
            {(rowData) => (
              <Button size="xs" onClick={() => console.log("Edit", rowData)}>
                Редагувати
              </Button>
            )}
          </Cell>
        </Column>
      </Table>

      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>
          <Modal.Title>Додати/Редагувати новину</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid formValue={formValue} onChange={setFormValue}>
            <Form.Group controlId="title">
              <Form.ControlLabel>Заголовок</Form.ControlLabel>
              <Form.Control name="title" />
            </Form.Group>
            <Form.Group controlId="description">
              <Form.ControlLabel>Опис</Form.ControlLabel>
              <Form.Control name="description" componentClass="textarea" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSave} appearance="primary">
            Зберегти
          </Button>
          <Button onClick={() => setShowModal(false)} appearance="subtle">
            Відміна
          </Button>
        </Modal.Footer>
      </Modal>
    </AppLayout>
  );
};

export default NewsPage;
