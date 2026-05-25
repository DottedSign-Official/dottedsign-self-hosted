import React from "react";
import { useTranslation } from "next-i18next";
import { systemTimeSetting } from "../../constants/constants";
import Checkbox from "../Checkbox";
import { Wrapper, Item, Label } from "./styled";

const FormatSystemTime = ({ isReadOnly, focus, onChange }) => {
  const { t } = useTranslation("common");

  return (
    <Wrapper>
      {systemTimeSetting.map((format, idx) => (
        <Item key={idx}>
          <Checkbox
            isChecked={format.key === focus}
            onToggle={() => onChange(format.key)}
            isReadOnly={isReadOnly}
            isRadio
          />
          <Label>{t(format.text)}</Label>
        </Item>
      ))}
    </Wrapper>
  );
};

export default FormatSystemTime;
