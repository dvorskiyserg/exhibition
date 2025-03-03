import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Form, Button, Message, Panel } from "rsuite";

const Login = () => {
  const [formValue, setFormValue] = useState({
    identifier: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setError("");

      const response = await axios.post(
        "http://localhost:1337/api/auth/local",
        {
          identifier: formValue.identifier,
          password: formValue.password,
        }
      );

      const { jwt, user } = response.data;

      // Запит даних користувача для отримання ролі
      const userResponse = await axios.get(
        "http://localhost:1337/api/users/me?populate=role",
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      const userData = {
        jwt,
        role: userResponse.data.role?.name || "authenticated",
      };

      console.log("Отримано користувача:", userData);

      // Зберігаємо користувача у контекст
      login(userData);

      // Переходимо на потрібну сторінку в залежності від ролі
      if (userData.role.toLowerCase() === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      console.error("Помилка входу:", err);
      setError("Помилка входу. Перевірте дані та спробуйте ще раз.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", padding: "20px" }}>
      <Panel header="Вхід" bordered>
        {error && <Message showIcon type="error" description={error} />}

        <Form
          fluid
          onChange={(value) => setFormValue(value)}
          formValue={formValue}
        >
          <Form.Group>
            <Form.ControlLabel>Email</Form.ControlLabel>
            <Form.Control name="identifier" />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Пароль</Form.ControlLabel>
            <Form.Control name="password" type="password" />
          </Form.Group>
          <Form.Group>
            <Button appearance="primary" onClick={handleLogin}>
              Увійти
            </Button>
          </Form.Group>
        </Form>

        {/* Перехід до реєстрації, якщо ще немає акаунта */}
        <div style={{ marginTop: 10, textAlign: "center" }}>
          Ще не маєте акаунта?{" "}
          <a href="/register" style={{ color: "#007bff", cursor: "pointer" }}>
            Зареєструватися
          </a>
        </div>
      </Panel>
    </div>
  );
};

export default Login;
