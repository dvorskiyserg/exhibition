import React from "react";
import Slider from "../components/Slider";
import { Container, Header, Content, Panel } from "rsuite";
import AboutExhibition from "../components/AboutExhibition";
import NewsSlider from "../components/NewsSlider";
import OrderInvitation from "../components/OrderInvitation";

const Home = () => {
  return (
    <Container>
      <Slider />
      <Content>
        <AboutExhibition />
        <NewsSlider />
        <OrderInvitation />
      </Content>
    </Container>
  );
};

export default Home;
