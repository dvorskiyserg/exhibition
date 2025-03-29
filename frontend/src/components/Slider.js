import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Button } from "rsuite";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../styles/slider.css";

import img1 from "../assets/slider/1.jpg";
import img2 from "../assets/slider/2.jpg";
import img3 from "../assets/slider/3.jpg";
import logoCircle from "../assets/slider/makosh_logo_circle.png";

// Масив зображень
const slides = [
  { type: "image", src: img1 },
  { type: "image", src: img2 },
  { type: "image", src: img3 },
];

const Slider = () => {
  return (
    <div className="slider-container" style={{ position: "relative" }}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        className="main-slider"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="slider-item">
              {slide.type === "image" ? (
                <img
                  src={slide.src}
                  alt={`Slide ${index + 1}`}
                  className="slider-image"
                />
              ) : (
                <video
                  className="slider-video"
                  autoPlay
                  muted
                  loop
                  playsInline
                  src={slide.src}
                />
              )}
              {/* Можна залишити затемнення для ефекту */}
              <div className="slider-overlay"></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Статичний overlay, який залишається на місці */}
      <div
        className="slider-overlay-content"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none", // Щоб overlay не блокував кліки по слайдеру (якщо потрібно, можна додати pointerEvents: 'auto' для кнопок)"
        }}
      >
        <img
          src={logoCircle}
          alt="Logo"
          className="slider-logo"
          style={{ marginBottom: "20px" }}
        />
        {/* <h2 className="slider-title" style={{ pointerEvents: "auto" }}>
          Ваш заголовок
        </h2> */}
        <div
          className="slider-buttons"
          style={{ marginTop: "20px", pointerEvents: "auto" }}
        >
          <Button className="order-btn">ЗАМОВИТИ УЧАСТЬ</Button>
          <Button className="visit-btn">ВІДВІДАТИ ВИСТАВКУ</Button>
        </div>
      </div>
    </div>
  );
};

export default Slider;
