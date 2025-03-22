import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Panel,
  Message,
  Modal,
  Form,
  Schema,
  Input,
  SelectPicker,
} from "rsuite";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const { Column, HeaderCell, Cell } = Table;
const { StringType } = Schema.Types;

const model = Schema.Model({
  username: StringType().isRequired("Обов'язкове поле"),
  email: StringType()
    .isEmail("Невірний email")
    .isRequired("Обов'язкове поле"),
});

const Textarea = React.forwardRef((props, ref) => (
  <Input {...props} as="textarea" ref={ref} />
));

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [formValue, setFormValue] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:1337/api/users?populate=role",
        {
          headers: { Authorization: `Bearer ${user.jwt}` },
        }
      );

      const onlyUsers = res.data.filter(
        (u) => u.role?.name?.toLowerCase() !== "admin"
      );
      setUsers(onlyUsers);
    } catch {
      setError("Помилка завантаження користувачів");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [user]);

  const handleEdit = (userData) => {
    setEditUser(userData);
    setFormValue(userData);
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `http://localhost:1337/api/users/${editUser.id}`,
        {
          fullname: formValue.fullname,
          username: formValue.username,
          email: formValue.email,
          phone: formValue.phone,
          website: formValue.website,
          description: formValue.description,
          user_status: formValue.user_status,
          organization: formValue.organization,
        },
        {
          headers: { Authorization: `Bearer ${user.jwt}` },
        }
      );
      setModalOpen(false);
      await fetchUsers(); // 🔄 Після оновлення — перезавантажити список
    } catch (error) {
      console.error("Помилка при оновленні користувача:", error);
    }
  };

  // ... JSX як раніше

  return (
    <Panel bordered header="Користувачі">
      {error && <Message type="error">{error}</Message>}
      <Table height={400} data={users} loading={loading} autoHeight>
        <Column width={50} align="center">
          <HeaderCell>ID</HeaderCell>
          <Cell dataKey="id" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Логін</HeaderCell>
          <Cell dataKey="username" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Повне ім’я</HeaderCell>
          <Cell dataKey="fullname" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Організація</HeaderCell>
          <Cell dataKey="organization" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Статус</HeaderCell>
          <Cell dataKey="user_status" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Дії</HeaderCell>
          <Cell>
            {(rowData) => (
              <Button
                size="xs"
                appearance="link"
                onClick={() => handleEdit(rowData)}
              >
                Редагувати
              </Button>
            )}
          </Cell>
        </Column>
      </Table>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} size="md">
        <Modal.Header>
          <Modal.Title>Редагування користувача</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            fluid
            model={model}
            formValue={formValue}
            onChange={setFormValue}
          >
            <Form.Group>
              <Form.ControlLabel>Username</Form.ControlLabel>
              <Form.Control name="username" />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Email</Form.ControlLabel>
              <Form.Control name="email" type="email" />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Статус</Form.ControlLabel>
              <Form.Control
                name="user_status"
                accepter={SelectPicker}
                data={[
                  { label: "Кандидат", value: "Кандидат" },
                  { label: "Учасник", value: "Учасник" },
                ]}
              />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Повне ім’я</Form.ControlLabel>
              <Form.Control name="fullname" />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Організація</Form.ControlLabel>
              <Form.Control name="organization" />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Телефон</Form.ControlLabel>
              <Form.Control name="phone" />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Вебсайт</Form.ControlLabel>
              <Form.Control name="website" />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Опис</Form.ControlLabel>
              <Form.Control name="description" accepter={Textarea} rows={3} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSave} appearance="primary">
            Зберегти
          </Button>
          <Button onClick={() => setModalOpen(false)} appearance="subtle">
            Скасувати
          </Button>
        </Modal.Footer>
      </Modal>
    </Panel>
  );
};

export default Users;
