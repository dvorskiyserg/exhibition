import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../styles/slider.css";

import img1 from "../assets/slider/1.jpg";
import img2 from "../assets/slider/2.jpg";
import img3 from "../assets/slider/3.jpg";
import img4 from "../assets/slider/4.jpg";
import logoCircle from "../assets/slider/makosh_logo_circle.png";

// Масив зображень
const slides = [
  { type: "image", src: img1 },
  { type: "image", src: img2 },
  // { type: "video", src: "/assets/video/promo-video.mp4" }, // Шлях до відео
  // { type: "image", src: img3 },
  { type: "image", src: img4 },
];

const Slider = () => {
  return (
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
            {/* Затемнення */}
            <div className="slider-overlay"></div>
            {/* Лого і текст по центру */}
            <div className="slider-content">
              <img
                src={logoCircle} // або твій логотип
                alt="Logo"
                className="slider-logo"
              />
              <h2 className="slider-title"></h2>
              <div className="slider-buttons">
                <button className="order-btn">ORDER PARTICIPATION</button>
                <button className="visit-btn">VISIT THE EXHIBITION</button>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Slider;
