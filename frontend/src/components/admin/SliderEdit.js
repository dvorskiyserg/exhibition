import React, { useEffect, useState } from "react";
import { Table, Button, Panel, Message } from "rsuite";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const { Column, HeaderCell, Cell } = Table;

const Slideredit = () => {
  const { user } = useAuth();
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:1337/api/slides", {
        headers: { Authorization: `Bearer ${user.jwt}` },
      })
      .then((res) => setSlides(res.data))
      .catch((err) => setError("Помилка завантаження слайдів"))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <Panel bordered header="Слайдер">
      {error && <Message type="error">{error}</Message>}
      <Table height={400} data={slides} loading={loading} autoHeight>
        <Column flexGrow={1}>
          <HeaderCell>ID</HeaderCell>
          <Cell dataKey="id" />
        </Column>
        <Column flexGrow={3}>
          <HeaderCell>Зображення</HeaderCell>
          <Cell>
            {(rowData) => (
              <img
                src={rowData.image}
                alt="Слайд"
                style={{ width: 80, height: 50, objectFit: "cover" }}
              />
            )}
          </Cell>
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Дата</HeaderCell>
          <Cell dataKey="createdAt" />
        </Column>
        <Column flexGrow={1}>
          <HeaderCell>Дії</HeaderCell>
          <Cell>
            {(rowData) => (
              <Button size="xs" appearance="link">
                Видалити
              </Button>
            )}
          </Cell>
        </Column>
      </Table>
    </Panel>
  );
};

export default Slideredit;
