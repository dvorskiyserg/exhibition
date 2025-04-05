import React from "react";
import { Button } from "rsuite";
import { useDrag, useDrop } from "react-dnd";
import API from "../../api/axiosInstance";
import "../../styles/draggable.css";

const type = "row";

const DraggableRow = ({ slide, index, moveRow, onEdit }) => {
  const ref = React.useRef(null);

  const [, drop] = useDrop({
    accept: type,
    hover(item) {
      if (item.index === index) return;
      moveRow(item.index, index);
      item.index = index;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div ref={ref} className={`draggable-row${isDragging ? " dragging" : ""}`}>
      <span>{slide.title}</span>
      <Button size="xs" appearance="link" onClick={() => onEdit(slide)}>
        Редагувати
      </Button>
    </div>
  );
};

export const saveOrder = async (slides, userJwt) => {
  try {
    await Promise.all(
      slides.map((slide, index) =>
        API.put(
          `/slider-items/${slide.strapiId}`, // strapiId тут — справжній ID, який був у відповіді Strapi
          {
            data: {
              order: index,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${userJwt}`,
            },
          }
        )
      )
    );
    console.log("Порядок слайдів збережено");
  } catch (err) {
    console.error("Помилка при збереженні порядку слайдів:", err);
  }
};

export default DraggableRow;
