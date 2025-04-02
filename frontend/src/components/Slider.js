import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Button } from "rsuite";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../styles/slider.css";

import logoCircle from "../assets/slider/makosh_logo_circle.png";

const getYouTubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const Slider = () => {
  const videoUrl = "https://www.youtube.com/watch?v=ynQbwkVRo3I";
  const videoId = getYouTubeId(videoUrl);

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
        <SwiperSlide>
          <div className="slider-item">
            <iframe
              className="responsive-iframe"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}`}
              title="Demo Slide"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                objectFit: "cover",
                width: "200vw",
                height: "200vh",
                position: "absolute",
                top: "-50vw",
                left: "-50vw",
                border: 0,
              }}
            ></iframe>
            <div className="slider-overlay"></div>
          </div>
        </SwiperSlide>
      </Swiper>

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
          pointerEvents: "none",
        }}
      >
        <img
          src={logoCircle}
          alt="Logo"
          className="slider-logo"
          style={{ marginBottom: "20px" }}
        />
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
