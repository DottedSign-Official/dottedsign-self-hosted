import React from "react";
import Input from "../../../../../../containers/Input";
import { Label, Item } from "../../styled";

const MAX_LENGTH = 200;
const MIN_LENGTH = 10;

const clampLength = (value) => {
  return Math.min(Math.max(value, MIN_LENGTH), MAX_LENGTH);
};

const TextLength = ({ t, onChange, length = MAX_LENGTH }) => {
  const onUpdateLength = (value, forceUpdate) => {
    const trimmedVal = Number(String(value)?.trim());

    if (Number.isNaN(trimmedVal)) {
      onChange(length);
      forceUpdate(length);
    } else if (trimmedVal < MIN_LENGTH || trimmedVal > MAX_LENGTH) {
      const clampedValue = clampLength(trimmedVal);
      onChange(clampedValue);
      forceUpdate(clampedValue);
    } else {
      onChange(trimmedVal);
    }
  };

  return (
    <>
      <Label>{t("text_length")}</Label>
      <Item>
        <Input
          placeholder={t("text_length")}
          value={length}
          onSubmit={onUpdateLength}
        />
      </Item>
    </>
  );
};

export default TextLength;
