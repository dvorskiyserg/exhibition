import React, { useState } from "react";
import { Form, Button, Panel, Message, Container } from "rsuite";

const Login = ({ onLogin }) => {
  const [formValue, setFormValue] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    try {
      // Тут твій запит до Strapi
      const response = await fetch("http://localhost:1337/api/auth/local", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: formValue.email,
          password: formValue.password,
        }),
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error.message);

      onLogin(data);
    } catch (err) {
      setError(err.message || "Помилка входу");
    }
  };

  return (
    <Container>
      <Panel header="Увійти" bordered>
        {error && (
          <Message showIcon type="error">
            {error}
          </Message>
        )}
        <Form fluid onChange={setFormValue} formValue={formValue}>
          <Form.Group>
            <Form.ControlLabel>Email</Form.ControlLabel>
            <Form.Control name="email" />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Пароль</Form.ControlLabel>
            <Form.Control name="password" type="password" />
          </Form.Group>
          <Button appearance="primary" onClick={handleSubmit}>
            Увійти
          </Button>
        </Form>
      </Panel>
    </Container>
  );
};

export default Login;
