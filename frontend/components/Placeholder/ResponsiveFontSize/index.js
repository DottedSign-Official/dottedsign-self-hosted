import { useRef, useEffect } from "react";
import { SVG, Text } from "./styled";

const ResponsiveText = ({ text, color, autoExpand, maxWidth }) => {
  const svgRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const render = () => {
      const svg = svgRef.current;
      const textNode = textRef.current;
      const { x, y, width, height } = textNode.getBBox();
      svg.setAttribute("viewBox", `${x} ${y} ${width} ${height}`);
    };

    render();

    // NOTE: Without a timeout, result of getBBox wont be accurate enough.
    const timer = setTimeout(render, 100);
    return () => {
      clearTimeout(timer);
    };
  });

  return (
    <>
      <SVG
        ref={svgRef}
        maxWidth={autoExpand ? "100%" : `${text.length * maxWidth}px`}
      >
        <Text ref={textRef} color={color || "gray"}>
          {text}
        </Text>
      </SVG>
    </>
  );
};

export default ResponsiveText;
