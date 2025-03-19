import React, { useState } from "react";
import { SelectPicker, Panel, Container, FlexboxGrid } from "rsuite";
import ImageGallery from "react-image-gallery";
import PageTitle from "../components/PageTitle";
import bgImage from "../assets/header-bg.jpg";
import "react-image-gallery/styles/css/image-gallery.css";
import "../styles/index.css";

// Базовий шлях для GH Pages (якщо використовується)
const basePath = process.env.PUBLIC_URL + "/gallery";

// Список виставок із фото
const exhibitions = [
  {
    id: 1,
    name: "Виставка 2023",
    images: [
      {
        original: `${basePath}/exhibition1/img1.jpg`,
        thumbnail: `${basePath}/exhibition1/img1.jpg`,
      },
      {
        original: `${basePath}/exhibition1/img2.jpg`,
        thumbnail: `${basePath}/exhibition1/img2.jpg`,
      },
      {
        original: `${basePath}/exhibition1/img3.jpg`,
        thumbnail: `${basePath}/exhibition1/img3.jpg`,
      },
    ],
  },
  {
    id: 2,
    name: "Виставка 2024",
    images: [
      {
        original: `${basePath}/exhibition2/img1.jpg`,
        thumbnail: `${basePath}/exhibition2/img1.jpg`,
      },
      {
        original: `${basePath}/exhibition2/img2.jpg`,
        thumbnail: `${basePath}/exhibition2/img2.jpg`,
      },
      {
        original: `${basePath}/exhibition2/img3.jpg`,
        thumbnail: `${basePath}/exhibition2/img3.jpg`,
      },
    ],
  },
];

const Gallery = () => {
  const [selectedExhibition, setSelectedExhibition] = useState(exhibitions[0]);

  const handleExhibitionChange = (value) => {
    const exhibition = exhibitions.find((ex) => ex.id === value);
    setSelectedExhibition(exhibition);
  };

  return (
    <Container>
      <PageTitle title="Сторінка учасника" backgroundImage={bgImage} />
      <FlexboxGrid justify="center"></FlexboxGrid>
      <Panel>
        {/* Вибір виставки */}
        <SelectPicker
          data={exhibitions.map((ex) => ({ label: ex.name, value: ex.id }))}
          onChange={handleExhibitionChange}
          defaultValue={selectedExhibition.id}
          searchable={false}
          style={{ width: 300, marginBottom: "20px" }}
        />

        {/* Відображення фото */}
        <ImageGallery
          items={selectedExhibition.images}
          showPlayButton={true} // Кнопка слайд-шоу
          showFullscreenButton={true} // Кнопка повноекранного режиму
          showThumbnails={true} // Мініатюри зображень
          slideInterval={3000} // Автоматичне переключення фото
        />
      </Panel>
    </Container>
  );
};

export default Gallery;
