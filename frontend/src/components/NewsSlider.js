import React from "react";
import { Card, Button } from "rsuite";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const newsItems = [
  {
    id: 1,
    title: "ідродження традицій у сучасному текстилі",
    description:
      "Українські дизайнери представлять нову колекцію одягу та аксесуарів, створених із використанням традиційних технік вишивки та ткацтва.",
    image: `${process.env.PUBLIC_URL}/news/news1.jpg`,
    link: "#",
  },
  {
    id: 2,
    title: "Еко-продукція: від українських виробників",
    description:
      "На виставці буде представлено широкий вибір натуральних продуктів, косметики та екологічних товарів для дому.",
    image: `${process.env.PUBLIC_URL}/news/news2.jpg`,
    link: "#",
  },
  {
    id: 3,
    title: "Майстер-класи від кращих гончарів України",
    description:
      "Гончарне мистецтво – це давня українська традиція, яка зберігається до сьогодні.",
    image: `${process.env.PUBLIC_URL}/news/news3.jpg`,
    link: "#",
  },
  {
    id: 4,
    title: "Вишивка як мистецтво: експозиція рідкісних візерунків",
    description: "Окрему зону виставки буде присвячено українській вишивці.",
    image: `${process.env.PUBLIC_URL}/news/news4.jpg`,
    link: "#",
  },
];

const NewsSlider = () => {
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
                  <p>{news.description}</p>
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
