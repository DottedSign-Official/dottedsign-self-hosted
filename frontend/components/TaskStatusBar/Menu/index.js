import React from "react";
import { useTranslation } from "next-i18next";
import { TASK_STATUS_BAR_ITEMS } from "../../../constants/constants";
import { Wrapper, Item, Count, Tag } from "./styled";

const TaskMenu = ({ focus, setFocus, typeCounter }) => {
  const { t } = useTranslation("common");

  return (
    <Wrapper>
      {Object.keys(TASK_STATUS_BAR_ITEMS).map((key, idx) => (
        <Item key={idx} isActive={focus === key} onClick={() => setFocus(key)}>
          <Count isActive={focus === key}>
            <span>(</span>
            {typeCounter[key]}
            <span>)</span>
          </Count>
          <Tag isActive={focus === key}>{t(TASK_STATUS_BAR_ITEMS[key])}</Tag>
        </Item>
      ))}
    </Wrapper>
  );
};

export default TaskMenu;
