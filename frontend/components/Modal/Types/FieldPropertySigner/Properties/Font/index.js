import React from "react";
import {
  fontSizeItem,
  itemAlignment,
  FILED_SETTING_DEFAULT_OPTIONS,
} from "../../../../../../constants/constants";
import tooltipType from "../../../../../../constants/tooltip";
import Tooltip from "../../../../../../containers/Tooltip";
import Select from "../../../../../../containers/Select";
import { Block, Label, Item } from "../../styled";

const Font = ({ t, onChange, fontSize, alignment }) => {
  const onSizeChanged = (itm) => {
    onChange({
      fontSize: itm.key,
    });
  };

  const onAlignmentChanged = (itm) => {
    onChange({
      alignment: itm.key,
    });
  };

  const activeSize =
    fontSizeItem.find((itm) => itm.key === fontSize) ||
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
      {fontSize && (
        <Block>
          <Label>
            {t("font_size")}
            <span>
              <Tooltip type={tooltipType.fontSize} />
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
        </Block>
      )}

      {alignment && (
        <Block>
          <Label>
            {t("alignment")}
            <span>
              <Tooltip type={tooltipType.alignment} />
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
        </Block>
      )}
    </>
  );
};

export default Font;
