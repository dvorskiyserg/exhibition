import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Form, Button, Panel, FlexboxGrid, Message } from "rsuite";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:1337/api/auth/local/register", {
        username,
        email,
        password,
      });

      await login(email, password);
      navigate("/profile");
    } catch (err) {
      setError("Помилка реєстрації, можливо, email вже використовується.");
    }
  };

  return (
    <FlexboxGrid justify="center" style={{ marginTop: "90px" }}>
      <FlexboxGrid.Item
        colspan={12}
        style={{
          maxWidth: "400px", // Максимальна ширина для великих екранів
          width: "90%", // Адаптивно займає 90% ширини на мобільних
        }}
      >
        <Panel header={<h3>Реєстрація</h3>} bordered>
          {error && <Message type="error">{error}</Message>}
          <Form fluid>
            <Form.Group>
              <Form.ControlLabel>Логін</Form.ControlLabel>
              <Form.Control
                name="username"
                onChange={setUsername}
                value={username}
              />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Email</Form.ControlLabel>
              <Form.Control
                name="email"
                type="email"
                onChange={setEmail}
                value={email}
              />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Пароль</Form.ControlLabel>
              <Form.Control
                name="password"
                type="password"
                onChange={setPassword}
                value={password}
              />
            </Form.Group>
            <Form.Group>
              <Button appearance="primary" block onClick={handleRegister}>
                Зареєструватися
              </Button>
            </Form.Group>
          </Form>
          <p>
            Вже маєте акаунт? <Link to="/login">Увійти</Link>
          </p>
        </Panel>
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
};

export default Register;
