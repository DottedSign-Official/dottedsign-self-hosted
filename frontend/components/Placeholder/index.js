import ResponsiveFontSize from "./ResponsiveFontSize";
import FixedFontSize from "./FixedFontSize";
import { Wrapper } from "./styled";
import { ALIGNMENT_TYPE } from "../../constants/constants";

export const PLACEHOLDER_COLOR = {
  HINT: "gray",
  TEXT: "black",
};
const Placeholder = ({
  fontSize,
  maxWidth,
  alignment,
  text,
  color,
  autoExpand,
  lineWrap,
  verticalAlignment,
}) => {
  const fixedFontProps = { text, color, fontSize, lineWrap };
  const responsiveFontProps = { text, color, autoExpand, maxWidth };

  return (
    <Wrapper
      alignment={alignment || ALIGNMENT_TYPE.CENTER}
      verticalAlignment={verticalAlignment || ALIGNMENT_TYPE.CENTER}
    >
      {!isNaN(fontSize) ? (
        <FixedFontSize {...fixedFontProps} />
      ) : (
        <ResponsiveFontSize {...responsiveFontProps} />
      )}
    </Wrapper>
  );
};

export default Placeholder;
