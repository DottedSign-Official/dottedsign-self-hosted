import React from "react";
import Checkbox from "../../../../../Checkbox";
import { Label, Item, ChkboxHint } from "../../styled";

const TextFormat = ({ t, onChange, isChecked }) => {
  return (
    <>
      <Label>{t("text_format")}</Label>
      <Item>
        <Checkbox isChecked={isChecked} onToggle={() => onChange(!isChecked)} />
        <ChkboxHint>{t("is_multi_line")}</ChkboxHint>
      </Item>
    </>
  );
};

export default TextFormat;
