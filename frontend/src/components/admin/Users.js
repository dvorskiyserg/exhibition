import React, { useEffect, useState } from "react";
import { Table, Button, Panel, Message } from "rsuite";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const { Column, HeaderCell, Cell } = Table;

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:1337/api/users", {
        headers: { Authorization: `Bearer ${user.jwt}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => setError("Помилка завантаження користувачів"))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <Panel bordered header="Користувачі">
      {error && <Message type="error">{error}</Message>}
      <Table height={400} data={users} loading={loading} autoHeight>
        <Column flexGrow={1}>
          <HeaderCell>ID</HeaderCell>
          <Cell dataKey="id" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Ім'я</HeaderCell>
          <Cell dataKey="username" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Email</HeaderCell>
          <Cell dataKey="email" />
        </Column>
        <Column flexGrow={1}>
          <HeaderCell>Роль</HeaderCell>
          <Cell dataKey="role.name" />
        </Column>
        <Column flexGrow={1}>
          <HeaderCell>Дії</HeaderCell>
          <Cell>
            {(rowData) => (
              <Button size="xs" appearance="link">
                Редагувати
              </Button>
            )}
          </Cell>
        </Column>
      </Table>
    </Panel>
  );
};

export default Users;
