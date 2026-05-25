import React, { useState } from "react";
import { Cursor, Wrapper } from "./styled";

const eventToMouseInfo = (event, element) => {
  let clientX, clientY;

  if (event.touches && event.touches.length > 0) {
    clientX = event.touches[0].clientX;
    clientY = event.touches[0].clientY;
  } else {
    clientX = event.clientX;
    clientY = event.clientY;
  }

  const rect = element.getBoundingClientRect();
  const mouseX = clientX - rect.left;
  const mouseY = clientY - rect.top;

  return { mouseX, mouseY };
};

const InteractiveCanvas = (
  { onMouseEvents, cursor: { size, isDashed } },
  ref,
) => {
  const [isDragging, setIsDragging] = useState(false);
  const [mouseInElement, setMouseInELement] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event) => {
    const { mouseX, mouseY } = eventToMouseInfo(event, ref.current);
    onMouseEvents({ mouseX, mouseY, isDragging, isMouseDown: false });
    setMousePosition({ x: mouseX, y: mouseY });
  };

  const handleMouseDown = (event) => {
    setIsDragging(true);
    const { mouseX, mouseY } = eventToMouseInfo(event, ref.current);
    onMouseEvents({ mouseX, mouseY, isDragging: true, isMouseDown: true });
    setMousePosition({ x: mouseX, y: mouseY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseEnter = () => {
    setMouseInELement(true);
  };

  const handleMouseLeave = () => {
    setMouseInELement(false);
    setIsDragging(false);
  };

  const handleTouchStart = (event) => {
    handleMouseDown(event);
    handleMouseEnter();
  };

  const handleTouchEnd = () => {
    handleMouseLeave();
    handleMouseUp();
  };

  return (
    <Wrapper>
      <canvas
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      {mouseInElement && !!size && (
        <Cursor
          size={size * 2}
          top={mousePosition.y}
          left={mousePosition.x}
          isDashed={isDashed}
        />
      )}
    </Wrapper>
  );
};
export default React.forwardRef(InteractiveCanvas);
