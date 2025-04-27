import React, { useRef } from "react";
import { Table } from "rsuite";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "../styles/draggable.css";

const { Column, HeaderCell, Cell } = Table;
const ItemTypes = { ROW: "row" };

function DraggableRowWrapper({ rowData, onDrag, children }) {
  const ref = useRef(null);
  const dropIndicatorRef = useRef(null);

  const [, drop] = useDrop({
    accept: ItemTypes.ROW,
    hover(item, monitor) {
      if (!ref.current || item.id === rowData.documentId) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dropIndicatorRef.current) {
        if (hoverClientY < hoverMiddleY) {
          dropIndicatorRef.current.style.top = "0px";
        } else {
          dropIndicatorRef.current.style.top = "calc(100% - 2px)";
        }
        dropIndicatorRef.current.style.display = "block";
      }
    },
    drop(item) {
      if (item.id !== rowData.documentId) {
        onDrag(item.id, rowData.documentId);
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.ROW,
    item: { id: rowData.documentId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`draggable-row${isDragging ? " dragging" : ""}`}
      onMouseLeave={() => {
        if (dropIndicatorRef.current) {
          dropIndicatorRef.current.style.display = "none";
        }
      }}
    >
      <div
        ref={dropIndicatorRef}
        className="drop-indicator"
        style={{ display: "none" }}
      />
      {children}
    </div>
  );
}

export default function DraggableTableWrapper({
  data,
  moveRow,
  children,
  ...props
}) {
  return (
    <DndProvider backend={HTML5Backend}>
      <Table
        autoHeight
        data={data}
        rowKey="documentId"
        components={{
          row: ({ children, rowData }) => (
            <DraggableRowWrapper rowData={rowData} onDrag={moveRow}>
              {children}
            </DraggableRowWrapper>
          ),
        }}
        {...props}
      >
        {children}
      </Table>
    </DndProvider>
  );
}
