import React from "react";
import Slider from "../components/Slider";
import { Container, Header, Content, Panel } from "rsuite";
import AboutExhibition from "../components/AboutExhibition";
import NewsSlider from "../components/NewsSlider";
import CallbackForm from "../components/CallbackForm";

const Home = () => {
  return (
    <Container>
      <Slider />
      <Content>
        <AboutExhibition />
        <NewsSlider />
        <CallbackForm />
      </Content>
    </Container>
  );
};

export default Home;
