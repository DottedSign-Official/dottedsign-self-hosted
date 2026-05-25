import { Text, Wrapper } from "./styled";

const ResponsiveText = ({ fontSize, text, color, lineWrap }) => (
  <Wrapper>
    <Text fontSize={fontSize} color={color || "gray"} lineWrap={lineWrap}>
      {text}
    </Text>
  </Wrapper>
);

export default ResponsiveText;
