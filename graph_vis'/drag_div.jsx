import React, { useState } from 'react';
import './drag_div.css';

const DraggableDiv = () => {
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  const handleMouseDown = (e) => {
    setDragging(true);
    setStartX(e.clientX);
    setStartWidth(e.target.parentNode.offsetWidth);
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const offsetX = e.clientX - startX;
    const newWidth = startWidth + offsetX;
    if (newWidth > 0) {
      e.target.parentNode.style.width = newWidth + 'px';
    }
  };

  return (
    <div className="draggable-container" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      <div className="handle" onMouseDown={handleMouseDown}></div>
      <div className="content">
        
      </div>
    </div>
  );
};

export default DraggableDiv;