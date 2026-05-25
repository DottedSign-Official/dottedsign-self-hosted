import React from "react";
import { useTranslation } from "next-i18next";
import { Label } from "../styled";
import { Wrapper, WrapperLabels, WrapperPanel } from "./styled";
import { GlobalBtn } from "../../../global/styledBtn";

const Menu = ({ labels, labelFocus, onTagClick, onClear }) => {
  const { t } = useTranslation("settings");

  const isClearable = labels && labels.length > 0 && labelFocus.length > 0;

  return (
    <Wrapper>
      <WrapperLabels>
        {labels &&
          labels.map((label, idx) => (
            <Label
              key={idx}
              onClick={() => onTagClick(label)}
              isFocus={labelFocus.indexOf(label) > -1}
            >
              <span>{label}</span>
            </Label>
          ))}
      </WrapperLabels>

      <WrapperPanel>
        <GlobalBtn
          theme={isClearable ? "primaryFlex" : "disabled"}
          onClick={isClearable ? onClear : null}
        >
          {t("clear_select")}
        </GlobalBtn>
      </WrapperPanel>
    </Wrapper>
  );
};

export default Menu;
