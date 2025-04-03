import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Button } from "rsuite";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../styles/slider.css";

import logoCircle from "../assets/slider/makosh_logo_circle.png";

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
        <SwiperSlide>
          <div className="slider-item">
            <iframe
              className="responsive-iframe"
              src="https://www.youtube.com/embed/ynQbwkVRo3I?start=7&autoplay=1&mute=1&loop=1&playlist=ynQbwkVRo3I"
              title="Demo Video Slide"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                left: "50%",
                minWidth: "100vw",
                minHeight: "100vh",
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
          marginTop: -180,
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
