import React, { useState } from "react";
import { Container, Panel, Form, Button, Message } from "rsuite";

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
            username: formValue.email,
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
    <Container>
      <Panel header="Реєстрація" bordered>
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
          <Button appearance="primary" onClick={handleRegister}>
            Зареєструватися
          </Button>
        </Form>
      </Panel>
    </Container>
  );
};

export default Register;
