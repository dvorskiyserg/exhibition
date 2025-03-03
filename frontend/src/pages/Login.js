import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Form, Button, Message, Panel } from "rsuite";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:1337/api/auth/local",
        {
          identifier: email,
          password,
        }
      );

      const jwt = response.data.jwt;
      const user = response.data.user;

      if (jwt) {
        // Запитуємо деталі користувача після логіну
        const meResponse = await axios.get(
          "http://localhost:1337/api/users/me?populate=role",
          {
            headers: { Authorization: `Bearer ${jwt}` },
          }
        );

        const fullUser = meResponse.data;
        const role = fullUser.role?.name || "authenticated"; // Тепер роль точно є

        // Зберігаємо дані в контексті
        login({ jwt, role });

        // Перенаправлення
        if (role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/profile");
        }
      } else {
        setError("Помилка авторизації. Перевірте дані.");
      }
    } catch (err) {
      setError("Невірний email або пароль.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto" }}>
      <Panel header="Вхід" bordered>
        {error && <Message type="error">{error}</Message>}
        <Form fluid>
          <Form.Group>
            <Form.ControlLabel>Email</Form.ControlLabel>
            <Form.Control name="email" value={email} onChange={setEmail} />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Пароль</Form.ControlLabel>
            <Form.Control
              name="password"
              type="password"
              value={password}
              onChange={setPassword}
            />
          </Form.Group>
          <Form.Group>
            <Button appearance="primary" onClick={handleLogin}>
              Увійти
            </Button>
          </Form.Group>
        </Form>
      </Panel>
    </div>
  );
};

export default Login;
