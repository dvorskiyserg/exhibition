import React, { useEffect, useState } from "react";
import { Table, Button, Panel, Message, Input, SelectPicker } from "rsuite";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const Emails = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:1337/api/users", {
        headers: { Authorization: `Bearer ${user.jwt}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => setError("Помилка завантаження користувачів"))
      .finally(() => setLoading(false));
  }, [user]);

  const handleSendEmail = async () => {
    try {
      await axios.post(
        "http://localhost:1337/api/send-email",
        {
          users: selectedUsers,
          subject,
          message,
        },
        { headers: { Authorization: `Bearer ${user.jwt}` } }
      );
      setSuccess("Лист успішно надіслано!");
    } catch (error) {
      setError("Не вдалося надіслати листи");
    }
  };

  return (
    <Panel bordered header="Розсилка">
      {error && <Message type="error">{error}</Message>}
      {success && <Message type="success">{success}</Message>}

      <SelectPicker
        data={users.map((u) => ({ label: u.email, value: u.id }))}
        searchable
        placeholder="Оберіть отримувачів"
        style={{ width: 300 }}
        onChange={setSelectedUsers}
        block
        multiple
      />

      <Input
        placeholder="Тема листа"
        value={subject}
        onChange={setSubject}
        style={{ marginTop: 10 }}
      />

      <Input
        as="textarea"
        placeholder="Текст листа"
        value={message}
        onChange={setMessage}
        rows={5}
        style={{ marginTop: 10 }}
      />

      <Button
        appearance="primary"
        onClick={handleSendEmail}
        style={{ marginTop: 10 }}
      >
        Відправити
      </Button>
    </Panel>
  );
};

export default Emails;
