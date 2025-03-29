import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:1337/api/slides"; // Змінюй під свою конфігурацію

const SlideManager = () => {
  const [slides, setSlides] = useState([]);
  const [newSlide, setNewSlide] = useState("");

  // Завантаження слайдів з Strapi
  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => setSlides(res.data.data))
      .catch((err) => console.error("Помилка завантаження слайдів:", err));
  }, []);

  // Додавання нового слайда
  const addSlide = () => {
    if (!newSlide) return;

    axios
      .post(API_URL, {
        data: { image: newSlide, alt: `Слайд ${slides.length + 1}` },
      })
      .then((res) => {
        setSlides([...slides, res.data.data]); // Оновлюємо стан
        setNewSlide(""); // Очищаємо поле
      })
      .catch((err) => console.error("Помилка додавання:", err));
  };

  // Видалення слайда
  const removeSlide = (id) => {
    axios
      .delete(`${API_URL}/${id}`)
      .then(() => setSlides(slides.filter((slide) => slide.id !== id)))
      .catch((err) => console.error("Помилка видалення:", err));
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Керування слайдером</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="URL картинки"
          value={newSlide}
          onChange={(e) => setNewSlide(e.target.value)}
          className="border p-2 flex-grow rounded"
        />
        <button
          onClick={addSlide}
          className="px-4 py-2 bg-primary text-white rounded"
        >
          Додати
        </button>
      </div>

      <div className="mt-4">
        {slides.map((slide) => (
          <div key={slide.id} className="flex items-center gap-4 mb-2">
            <img
              src={slide.attributes.image}
              alt={slide.attributes.alt}
              className="w-16 h-16 object-cover rounded"
            />
            <button
              onClick={() => removeSlide(slide.id)}
              className="text-red-500"
            >
              Видалити
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlideManager;
