import React from "react";
import tooltipType from "../../../../../../constants/tooltip";
import Tooltip from "../../../../../../containers/Tooltip";
import Input from "../../../../../../containers/Input";
import Textarea from "../../../../../Textarea";
import { Label, Item } from "../../styled";

const Default = ({
  t,
  value = "",
  onChange,
  isMultiLine,
  onChangeFormatter,
}) => {
  const onSubmit = (value) => {
    const trimmedVal = value?.trim() || null;
    onChange(trimmedVal);
  };

  const content = (() => {
    if (isMultiLine) {
      return (
        <Textarea
          value={value || ""}
          onSubmit={onSubmit}
          placeholder={t("default_text")}
          isHideCounter
          postProcessor={onChangeFormatter}
        />
      );
    }

    return (
      <Input
        placeholder={t("default_text")}
        value={value}
        onSubmit={onSubmit}
      />
    );
  })();

  return (
    <>
      <Label>
        {t("default_text")}
        <span>
          <Tooltip type={tooltipType.defaultValue} position={"top"} />
        </span>
      </Label>
      <Item>{content}</Item>
    </>
  );
};

export default Default;
