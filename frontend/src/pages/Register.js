import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Message, Panel } from "rsuite";

const Register = () => {
  const [formValue, setFormValue] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      setError("");
      await axios.post("http://localhost:1337/api/auth/local/register", {
        username: formValue.username,
        email: formValue.email,
        password: formValue.password,
      });
      navigate("/login");
    } catch (err) {
      setError("Не вдалося зареєструватися");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto" }}>
      <Panel header="Реєстрація" bordered>
        <Form
          fluid
          onChange={setFormValue}
          formValue={formValue}
          onSubmit={handleRegister}
        >
          <Form.Group>
            <Form.ControlLabel>Ім'я користувача</Form.ControlLabel>
            <Form.Control name="username" required />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Email</Form.ControlLabel>
            <Form.Control name="email" type="email" required />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Пароль</Form.ControlLabel>
            <Form.Control name="password" type="password" required />
          </Form.Group>
          {error && <Message type="error">{error}</Message>}
          <Form.Group>
            <Button appearance="primary" type="submit">
              Зареєструватися
            </Button>
          </Form.Group>
        </Form>
        <p style={{ marginTop: "10px", textAlign: "center" }}>
          Вже є акаунт?{" "}
          <Link to="/login" style={{ textDecoration: "underline" }}>
            Увійти
          </Link>
        </p>
      </Panel>
    </div>
  );
};

export default Register;
