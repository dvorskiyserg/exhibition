import axios from "axios";

const API_URL = "http://localhost:1337/api/slides"; // Онови, якщо API має інший шлях

export const getSlides = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.data.map((slide) => ({
      id: slide.id,
      image: slide.attributes.imageUrl, // Зміни поле, якщо в API інша назва
      alt: slide.attributes.title || "Слайд",
    }));
  } catch (error) {
    console.error("Помилка при отриманні слайдів:", error);
    return [];
  }
};
