import React, { useEffect, useState } from "react";
import { Card, Button } from "rsuite";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useAuth } from "../context/AuthContext";
import API from "../api/axiosInstance";

const NewsSlider = () => {
  const { user } = useAuth();
  const [newsItems, setNewsItems] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await API.get("/news-lists?populate=image", {
          headers: { Authorization: `Bearer ${user.jwt}` },
        });
        const items =
          res.data?.data.map((item) => ({
            id: item.id,
            title:
              item.title || (item.attributes && item.attributes.title) || "",
            content:
              item.content ||
              (item.attributes && item.attributes.content) ||
              "",
            image: item.image
              ? `http://localhost:1337${item.image.url}`
              : item.attributes && item.attributes.image
              ? `http://localhost:1337${item.attributes.image.url}`
              : "",
            link: "#",
          })) || [];
        setNewsItems(items);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNews();
  }, [user]);

  const getPreviewText = (content) => {
    if (Array.isArray(content)) {
      return content
        .map((block) =>
          block.children
            ? block.children.map((child) => child.text).join(" ")
            : ""
        )
        .join(" ")
        .slice(0, 100);
    } else if (typeof content === "object" && content !== null) {
      return content.children
        ? content.children
            .map((child) => child.text)
            .join(" ")
            .slice(0, 100)
        : "";
    } else if (typeof content === "string") {
      return content.slice(0, 100);
    }
    return "—";
  };

  return (
    <div style={{ padding: "50px 0", backgroundColor: "#fff" }}>
      <div
        style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}
      >
        <h2>НОВИНИ</h2>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={3}
          autoplay={{ delay: 4000 }}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          style={{ padding: "20px 0" }}
        >
          {newsItems.map((news) => (
            <SwiperSlide key={news.id}>
              <Card bordered style={{ width: "100%", height: "100%" }}>
                <img
                  src={news.image}
                  alt={news.title}
                  style={{ width: "100%", height: "160px", objectFit: "cover" }}
                />
                <Card.Body>
                  <h5 style={{ marginBottom: "5px" }}>{news.title}</h5>
                  <p>{getPreviewText(news.content)}</p>
                  <a href={news.link} style={{ color: "#f90" }}>
                    Детальніше &gt;
                  </a>
                </Card.Body>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>

        <div style={{ marginTop: "20px" }}>
          <Button href="#all-news" appearance="primary" className="form-button">
            Всі новини
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewsSlider;
