import React from "react";
import { Container, Panel, Table } from "rsuite";

const { Column, HeaderCell, Cell } = Table;

const AdminPanel = ({ users }) => {
  return (
    <Container>
      <Panel header="Адмін Панель" bordered>
        <Table height={400} data={users}>
          <Column width={200} align="center">
            <HeaderCell>ID</HeaderCell>
            <Cell dataKey="id" />
          </Column>
          <Column width={200}>
            <HeaderCell>Ім'я</HeaderCell>
            <Cell dataKey="firstName" />
          </Column>
          <Column width={200}>
            <HeaderCell>Email</HeaderCell>
            <Cell dataKey="email" />
          </Column>
        </Table>
      </Panel>
    </Container>
  );
};

export default AdminPanel;
