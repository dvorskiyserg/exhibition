import React, { useState } from "react";
import { Container, Panel, Form, Button, Message, ButtonToolbar } from "rsuite";
import { useAuth } from "../context/AuthContext"; // Додаємо хук для виходу

const Profile = ({ user, jwt }) => {
  const [formValue, setFormValue] = useState(user);
  const [message, setMessage] = useState("");

  const { logout } = useAuth(); // Отримуємо функцію виходу

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

  const handleLogout = () => {
    logout(); // Очищення локального збереження і стану
    window.location.href = "/"; // Повернення на головну сторінку після виходу
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
          <ButtonToolbar>
            <Button appearance="primary" onClick={handleSave}>
              Зберегти
            </Button>
            <Button appearance="subtle" color="red" onClick={handleLogout}>
              Вийти
            </Button>
          </ButtonToolbar>
        </Form>
      </Panel>
    </Container>
  );
};

export default Profile;
