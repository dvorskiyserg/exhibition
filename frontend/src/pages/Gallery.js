import React, { useState } from "react";
import { SelectPicker, Panel, Container, FlexboxGrid } from "rsuite";
import ArrowDownLineIcon from "@rsuite/icons/ArrowDownLine";
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
      {
        original: `${basePath}/exhibition1/img4.jpg`,
        thumbnail: `${basePath}/exhibition1/img4.jpg`,
      },
      {
        original: `${basePath}/exhibition1/img5.jpg`,
        thumbnail: `${basePath}/exhibition1/img5.jpg`,
      },
      {
        original: `${basePath}/exhibition1/img6.jpg`,
        thumbnail: `${basePath}/exhibition1/img6.jpg`,
      },
      {
        original: `${basePath}/exhibition1/img7.jpg`,
        thumbnail: `${basePath}/exhibition1/img7.jpg`,
      },
      {
        original: `${basePath}/exhibition1/img8.jpg`,
        thumbnail: `${basePath}/exhibition1/img8.jpg`,
      },
      {
        original: `${basePath}/exhibition1/img9.jpg`,
        thumbnail: `${basePath}/exhibition1/img9.jpg`,
      },
      {
        original: `${basePath}/exhibition1/img10.jpg`,
        thumbnail: `${basePath}/exhibition1/img10.jpg`,
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
      {
        original: `${basePath}/exhibition2/img4.jpg`,
        thumbnail: `${basePath}/exhibition2/img4.jpg`,
      },
      {
        original: `${basePath}/exhibition2/img5.jpg`,
        thumbnail: `${basePath}/exhibition2/img5.jpg`,
      },
      {
        original: `${basePath}/exhibition2/img6.jpg`,
        thumbnail: `${basePath}/exhibition2/img6.jpg`,
      },
      {
        original: `${basePath}/exhibition2/img7.jpg`,
        thumbnail: `${basePath}/exhibition2/img7.jpg`,
      },
      {
        original: `${basePath}/exhibition2/img8.jpg`,
        thumbnail: `${basePath}/exhibition2/img8.jpg`,
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
          renderMenuItem={(label, item) => (
            <div style={{ display: "flex", alignItems: "center" }}>{label}</div>
          )}
          renderValue={(value, item) => (
            <div style={{ display: "flex", alignItems: "center" }}>
              {item.label}
              <ArrowDownLineIcon
                className="arrow-down-icon"
                style={{ marginLeft: 8 }}
              />
            </div>
          )}
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
