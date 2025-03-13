import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Panel, FlexboxGrid, Message } from "rsuite";
import PageTitle from "../components/PageTitle";
import bgImage from "../assets/header-bg.jpg"; // додай потрібну картинку в assets

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await login(identifier, password);
      const userData = JSON.parse(localStorage.getItem("user"));

      if (userData.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      setError("Невірний логін або пароль.");
    }
  };

  return (
    <>
      <PageTitle title="Сторінка учасника" backgroundImage={bgImage} />
      <FlexboxGrid
        justify="center"
        style={{ marginTop: "120px", marginBottom: "80px" }}
      >
        <FlexboxGrid.Item
          colspan={24}
          style={{
            maxWidth: "400px", // Максимальна ширина для великих екранів
            width: "90%", // Адаптивно займає 90% ширини на мобільних
          }}
        >
          <Panel header={<h3>Вхід</h3>} bordered>
            {error && <Message type="error">{error}</Message>}
            <Form fluid>
              <Form.Group>
                <Form.ControlLabel>Email або Логін</Form.ControlLabel>
                <Form.Control
                  name="identifier"
                  onChange={setIdentifier}
                  value={identifier}
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
                <Button
                  appearance="primary"
                  block
                  onClick={handleLogin}
                  style={{ backgroundColor: "#ff9800", border: "none" }}
                >
                  Увійти
                </Button>
              </Form.Group>
            </Form>
            <p style={{ textAlign: "center" }}>
              Не маєте акаунта? <Link to="/register">Зареєструватися</Link>
            </p>
          </Panel>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </>
  );
};

export default Login;
