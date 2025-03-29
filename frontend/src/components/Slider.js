import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Button } from "rsuite";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../styles/slider.css";

import logoCircle from "../assets/slider/makosh_logo_circle.png";
import API from "../api/axiosInstance";

const getYouTubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const Slider = () => {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await API.get("/slider-items?populate=image", {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        });
        const fetched = res.data?.data || [];
        const normalized = fetched
          .filter((item) => item.published)
          .map((item) => {
            const { type, videoUrl, image } = item;
            const imgUrl =
              image?.data?.attributes?.url &&
              `${process.env.REACT_APP_STRAPI_URL}${image.data.attributes.url}`;
            return {
              type,
              src: type === "video" ? videoUrl : imgUrl,
            };
          });
        setSlides(normalized);
      } catch (error) {
        console.error("Не вдалося отримати слайди", error);
      }
    };

    fetchSlides();
  }, []);

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
                <div
                  className="slider-video-container"
                  style={{ width: "100%", height: "100%" }}
                >
                  {getYouTubeId(slide.src) ? (
                    <iframe
                      className="responsive-iframe"
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${getYouTubeId(
                        slide.src
                      )}?autoplay=1&mute=1&loop=1&playlist=${getYouTubeId(
                        slide.src
                      )}`}
                      title={`Video Slide ${index + 1}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ objectFit: "cover" }}
                    ></iframe>
                  ) : (
                    <p>Невірний YouTube URL</p>
                  )}
                </div>
              )}
              <div className="slider-overlay"></div>
            </div>
          </SwiperSlide>
        ))}
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
