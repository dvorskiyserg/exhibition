import React from "react";
import { Container, Header, Content, Panel } from "rsuite";

const Home = () => {
  return (
    <Container>
      <Header>
        <h2>Головна сторінка</h2>
      </Header>
      <Content>
        <Panel bordered header="Ласкаво просимо">
          Це головна сторінка сайту виставки.
        </Panel>
      </Content>
    </Container>
  );
};

export default Home;
