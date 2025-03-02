import React from "react";
import Slider from "../components/Slider";
import { Container, Header, Content, Panel } from "rsuite";

const Home = () => {
  return (
    <Container>
      <Slider />
      <Content>
        <Panel bordered header="Ласкаво просимо">
          Це головна сторінка сайту виставки.
        </Panel>
      </Content>
    </Container>
  );
};

export default Home;
