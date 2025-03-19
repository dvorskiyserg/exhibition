import React from "react";
import { Container, FlexboxGrid, Panel } from "rsuite";
import PageTitle from "../components/PageTitle"; // Компонент для смужки заголовку
import bgImage from "../assets/header-bg.jpg"; // Фонове зображення
// import img1 from "../assets/gallery/img1.jpg"; // Приклади фото
// import img2 from "../assets/gallery/img2.jpg";
// import img3 from "../assets/gallery/img3.jpg";

const Gallery = () => {
  const images = [
    `${process.env.PUBLIC_URL}/gallery/img1.jpg`,
    `${process.env.PUBLIC_URL}/gallery/img2.jpg`,
    `${process.env.PUBLIC_URL}/gallery/img3.jpg`,
  ];

  return (
    <>
      <PageTitle title="Галерея" backgroundImage={bgImage} />
      <FlexboxGrid
        justify="center"
        style={{ marginTop: "120px", marginBottom: "100px" }}
      >
        <Container style={{ maxWidth: "1000px" }}>
          <Panel bordered style={{ padding: "30px" }}>
            <h3>Наші роботи</h3>
            <FlexboxGrid
              justify="center"
              style={{ marginTop: "20px" }}
              gutter={20}
            >
              {images.map((src, index) => (
                <FlexboxGrid.Item
                  key={index}
                  colspan={8}
                  style={{ textAlign: "center" }}
                >
                  <img
                    src={src}
                    alt={`gallery-${index}`}
                    style={{ width: "100%", borderRadius: "10px" }}
                  />
                </FlexboxGrid.Item>
              ))}
            </FlexboxGrid>
          </Panel>
        </Container>
      </FlexboxGrid>
    </>
  );
};

export default Gallery;
