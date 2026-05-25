import React from "react";
import { useTranslation } from "next-i18next";
import Icon from "../Icon";
import data from "./data";
import { Item } from "./styled";

const EditPanel = ({ types, isViewOnly, focusPanel, onTypeClick }) => {
  const { t } = useTranslation("create");

  return data
    .filter(({ type }) => types.includes(type))
    .map((panel, idx) => {
      return (
        <Item
          key={idx}
          isFocus={focusPanel === panel}
          onClick={() => onTypeClick(panel)}
          isViewOnly={isViewOnly}
        >
          <Icon type={focusPanel === panel ? panel.icons[1] : panel.icons[0]} />
          <p>{t(panel.text)}</p>
        </Item>
      );
    });
};

export default EditPanel;
