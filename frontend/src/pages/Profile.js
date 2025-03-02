import React, { useState, useEffect } from "react";
import { Container, Panel, Form, Button, Message } from "rsuite";

const Profile = ({ user, jwt }) => {
  const [formValue, setFormValue] = useState(user);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    try {
      const response = await fetch(
        `http://localhost:1337/api/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify(formValue),
        }
      );

      if (!response.ok) throw new Error("Не вдалося зберегти профіль");

      setMessage("Дані успішно збережено!");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <Container>
      <Panel header="Мій профіль" bordered>
        {message && (
          <Message showIcon type="info">
            {message}
          </Message>
        )}
        <Form fluid formValue={formValue} onChange={setFormValue}>
          <Form.Group>
            <Form.ControlLabel>Ім'я</Form.ControlLabel>
            <Form.Control name="firstName" />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Прізвище</Form.ControlLabel>
            <Form.Control name="lastName" />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Компанія</Form.ControlLabel>
            <Form.Control name="company" />
          </Form.Group>
          <Button appearance="primary" onClick={handleSave}>
            Зберегти
          </Button>
        </Form>
      </Panel>
    </Container>
  );
};

export default Profile;
