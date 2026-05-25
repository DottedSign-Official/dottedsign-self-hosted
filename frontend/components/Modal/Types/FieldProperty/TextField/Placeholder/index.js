import React, { useRef } from "react";
import tooltipType, { POSITION } from "../../../../../../constants/tooltip";
import Tooltip from "../../../../../../containers/Tooltip";
import Input from "../../../../../../containers/Input";
import Textarea from "../../../../../Textarea";
import { Label, Item } from "../../styled";

const Placeholder = ({ t, onChange, placeholder, isMultiLine }) => {
  const refInput = useRef();

  const onSubmit = (value) => {
    const trimmedVal = value?.trim() || null;

    onChange(trimmedVal);
  };

  const content = (() => {
    if (isMultiLine) {
      return (
        <Textarea
          value={placeholder || ""}
          onSubmit={onSubmit}
          placeholder={t("placeholder")}
          isHideCounter
        />
      );
    }

    return (
      <Input
        refInput={refInput}
        placeholder={t("placeholder")}
        value={placeholder || ""}
        onSubmit={onSubmit}
      />
    );
  })();

  return (
    <>
      <Label>
        {t("placeholder")}
        <span>
          <Tooltip type={tooltipType.placeholder} position={POSITION.top} />
        </span>
      </Label>
      <Item>{content}</Item>
    </>
  );
};

export default Placeholder;
