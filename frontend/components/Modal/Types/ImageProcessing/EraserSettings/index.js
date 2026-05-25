import Checkbox from "../../../../Checkbox";
import { CheckboxWrapper } from "./styled";
import Tooltip from "../../../../../containers/Tooltip";
import tooltipType from "../../../../../constants/tooltip";
import { Text, Range } from "../styled";

const EraserSettings = ({
  t,
  radius,
  onRadiusChange,
  isRestore,
  onToggleRestore,
}) => {
  const handleRadiusChange = (event) => {
    onRadiusChange(event.target.value);
  };

  return (
    <>
      <Text>{t("modal_edit_stamp_eraser_size")}</Text>
      <Range
        type="range"
        min="0"
        max="100"
        value={radius}
        onChange={handleRadiusChange}
      />
      <CheckboxWrapper>
        <Checkbox isChecked={isRestore} onToggle={onToggleRestore} />
        <span>{t("modal_edit_stamp_eraser_restore")}</span>
        <Tooltip type={tooltipType.eraserRestoreMode} />
      </CheckboxWrapper>
    </>
  );
};

export default EraserSettings;
