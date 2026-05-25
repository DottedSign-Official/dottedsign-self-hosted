import ColorPickers from "../ColorPickers";
import { GL_UNIFORMS_ARRAY_SIZE_MAX } from "../../../../../helpers/webgl/constant";
import Tooltip from "../../../../../containers/Tooltip";
import tooltipType from "../../../../../constants/tooltip";
import { ToleranceWrapper } from "./styled";
import { Text, Range } from "../styled";

const ChromaKeySettings = ({
  t,
  threshold,
  onThresholdChange,
  selectedColors,
  onColorsChange,
}) => {
  const handleThresholdChange = (event) => {
    onThresholdChange(event.target.value);
  };

  return (
    <>
      <ToleranceWrapper>
        <Text>{t("modal_edit_stamp_threshold")}</Text>
        <Tooltip type={tooltipType.backgroundRemovalThreshold} />
      </ToleranceWrapper>
      <Range
        type="range"
        min="0"
        max="100"
        value={threshold}
        onChange={handleThresholdChange}
      />
      <Text>{t("modal_edit_stamp_background_color")}</Text>
      <ColorPickers
        selectedColors={selectedColors}
        setSelectedColors={onColorsChange}
        limit={GL_UNIFORMS_ARRAY_SIZE_MAX}
      />
    </>
  );
};

export default ChromaKeySettings;
