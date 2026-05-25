import React from "react";
import {
  fontSizeItem,
  itemAlignment,
  FILED_SETTING_DEFAULT_OPTIONS,
} from "../../../../../../constants/constants";
import tooltipType from "../../../../../../constants/tooltip";
import Tooltip from "../../../../../../containers/Tooltip";
import Select from "../../../../../../containers/Select";
import Checkbox from "../../../../../Checkbox";
import { Block, Label, Item, ChkboxHint, Break } from "../../styled";

const Font = ({
  t,
  onChange,
  font_size,
  font_size_fixed,
  alignment,
  alignment_fixed,
}) => {
  const onSizeChanged = (itm) => {
    onChange({
      font_size: itm.key,
    });
  };

  const onSizeFixedToggle = () => {
    onChange({
      font_size_fixed: !font_size_fixed,
    });
  };

  const onAlignmentChanged = (itm) => {
    onChange({
      alignment: itm.key,
    });
  };

  const onAlignmentFixedToggle = () => {
    onChange({
      alignment_fixed: !alignment_fixed,
    });
  };

  const activeSize =
    fontSizeItem.find((itm) => itm.key === font_size) ||
    fontSizeItem.find(
      (itm) => itm.key === FILED_SETTING_DEFAULT_OPTIONS.TEXT.FONT_SIZE,
    );

  const activeAlignment =
    itemAlignment.find((itm) => itm.key === alignment) ||
    itemAlignment.find(
      (itm) => itm.key === FILED_SETTING_DEFAULT_OPTIONS.TEXT.ALIGNMENT,
    );

  return (
    <>
      <Block>
        <Label>
          {t("font_size")}
          <span>
            <Tooltip type={tooltipType.fontSize} position={"top"} />
          </span>
        </Label>
        <Item>
          <Select
            activeItem={activeSize}
            items={fontSizeItem}
            indexKey="key"
            indexText="text"
            onSelectEvent={onSizeChanged}
          />
        </Item>
        <Break />
        <Item>
          <Checkbox isChecked={font_size_fixed} onToggle={onSizeFixedToggle} />
          <ChkboxHint>{t("font_size_fixed")}</ChkboxHint>
        </Item>
      </Block>

      <Block>
        <Label>
          {t("alignment")}
          <span>
            <Tooltip type={tooltipType.alignment} position={"top"} />
          </span>
        </Label>
        <Item>
          <Select
            activeItem={activeAlignment}
            items={itemAlignment}
            indexKey="key"
            indexText="text"
            onSelectEvent={onAlignmentChanged}
          />
        </Item>
        <Break />
        <Item>
          <Checkbox
            isChecked={alignment_fixed}
            onToggle={onAlignmentFixedToggle}
          />
          <ChkboxHint>{t("alignment_fixed")}</ChkboxHint>
        </Item>
      </Block>
    </>
  );
};

export default Font;
