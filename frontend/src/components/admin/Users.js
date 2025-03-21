import React, { useState, useEffect } from "react";
import AppLayout from "./AppLayout";
import { Table, Tag, IconButton } from "rsuite";
import EditIcon from "@rsuite/icons/Edit";

const { Column, HeaderCell, Cell } = Table;

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:1337/api/users")
      .then((res) => res.json())
      .then(setUsers)
      .catch(console.error);
  }, []);

  return (
    <AppLayout>
      <h4>Користувачі</h4>
      <Table data={users} autoHeight bordered>
        <Column width={200} align="center" fixed>
          <HeaderCell>Ім'я</HeaderCell>
          <Cell dataKey="username" />
        </Column>
        <Column width={200}>
          <HeaderCell>Email</HeaderCell>
          <Cell dataKey="email" />
        </Column>
        <Column width={150}>
          <HeaderCell>Роль</HeaderCell>
          <Cell>
            {(rowData) => <Tag color="blue">{rowData.role?.name}</Tag>}
          </Cell>
        </Column>
        <Column width={100} align="center">
          <HeaderCell>Дії</HeaderCell>
          <Cell>
            {(rowData) => (
              <IconButton
                icon={<EditIcon />}
                onClick={() => console.log("Редагувати", rowData)}
                appearance="subtle"
              />
            )}
          </Cell>
        </Column>
      </Table>
    </AppLayout>
  );
};

export default Users;
