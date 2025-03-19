import React, { useState, useEffect } from "react";
import {
  Container,
  Panel,
  Form,
  Button,
  Message,
  ButtonToolbar,
  Avatar,
  Input,
} from "rsuite";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, setUser, logout } = useAuth();
  const [formValue, setFormValue] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setFormValue({
        fullname: user.fullname || "",
        organization: user.organization || "",
        website: user.website || "",
        phone: user.phone || "",
        description: user.description || "",
        user_status: user.user_status || "Кандидат",
      });
      setLoading(false);
    }
  }, [user]);

  const handleSave = async () => {
    if (!user || !user.id) {
      console.error("User ID не знайдено", user);
      return;
    }

    const updateData = {
      fullname: formValue.fullname,
      organization: formValue.organization,
      website: formValue.website,
      phone: formValue.phone,
      description: formValue.description,
      user_status: formValue.user_status,
    };

    console.log("Відправляю запит:", updateData);

    try {
      const response = await fetch(
        `http://localhost:1337/api/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.jwt}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Помилка відповіді сервера:", errorData);
        throw new Error("Не вдалося зберегти профіль");
      }

      setUser((prevUser) => ({
        ...prevUser,
        ...updateData,
      }));
      setMessage("Дані успішно збережено!");
    } catch (error) {
      console.error("Помилка збереження профілю:", error);
      setMessage("Не вдалося зберегти профіль");
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <Container>
        <Panel header="Мій профіль" bordered>
          <Message type="info">Завантаження...</Message>
        </Panel>
      </Container>
    );
  }

  return (
    <Container style={{ maxWidth: "100%", padding: "20px" }}>
      <Panel header={<h2>Мій профіль</h2>} bordered style={{ width: "100%" }}>
        {message && (
          <Message showIcon type="info">
            {message}
          </Message>
        )}

        <Form
          fluid
          formValue={formValue}
          onChange={(newFormValue) => setFormValue(newFormValue)}
          style={{ width: "100%" }}
        >
          <Form.Group>
            <Form.ControlLabel>Повне ім'я</Form.ControlLabel>
            <Form.Control name="fullname" />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Організація</Form.ControlLabel>
            <Form.Control name="organization" />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Вебсайт</Form.ControlLabel>
            <Form.Control name="website" />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Телефон</Form.ControlLabel>
            <Form.Control name="phone" />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Опис діяльності</Form.ControlLabel>
            <Input
              name="description"
              as="textarea"
              rows={3}
              value={formValue.description}
              onChange={(value) =>
                setFormValue((prev) => ({ ...prev, description: value }))
              }
            />
          </Form.Group>

          {/* Статус користувача */}
          <Form.Group>
            <Form.ControlLabel>Статус</Form.ControlLabel>
            <p
              style={{
                fontWeight: "bold",
                fontSize: "16px",
                color: user.user_status === "participant" ? "green" : "gray",
              }}
            >
              {user.user_status || "Кандидат"}
            </p>
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
