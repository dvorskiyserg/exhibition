import React, { useState } from "react";
import { Container, Panel, Form, Button, Message } from "rsuite";
import { Link } from "react-router-dom";

const Register = () => {
  const [formValue, setFormValue] = useState({});
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    try {
      const response = await fetch(
        "http://localhost:1337/api/auth/local/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formValue,
            username: formValue.email, // Strapi вимагає username
          }),
        }
      );

      const data = await response.json();

      if (data.error) throw new Error(data.error.message);

      setMessage("Реєстрація успішна! Ви можете увійти.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <Container className="register-container">
      <Panel header="Реєстрація" bordered className="register-panel">
        {message && (
          <Message showIcon type="info">
            {message}
          </Message>
        )}
        <Form fluid formValue={formValue} onChange={setFormValue}>
          <Form.Group>
            <Form.ControlLabel>Email</Form.ControlLabel>
            <Form.Control name="email" />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Пароль</Form.ControlLabel>
            <Form.Control name="password" type="password" />
          </Form.Group>
          <Form.Group>
            <Button appearance="primary" onClick={handleRegister}>
              Зареєструватися
            </Button>
          </Form.Group>
        </Form>
        <div className="login-link">
          <p>
            Вже маєте обліковий запис? <Link to="/login">Увійти</Link>
          </p>
        </div>
      </Panel>
    </Container>
  );
};

export default Register;
