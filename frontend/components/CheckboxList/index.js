import React from "react";
import { useTranslation } from "next-i18next";
import Icon from "../Icon";
import Checkbox from "../Checkbox";
import {
  Wrapper,
  ItemActive,
  Text,
  WrapperIcon,
  Menu,
  MenuItem,
} from "./styled";

const CheckboxList = ({
  isCollapse,
  indexText,
  text,
  indexKey,
  items,
  onSelectBlur,
  onMenuTick,
  onCheckboxToggle,
  setIsCollapse,
}) => {
  const { t } = useTranslation("common");

  return (
    <Wrapper tabIndex="5566123" onBlur={onSelectBlur}>
      <ItemActive onClick={onMenuTick}>
        <Text>{t(text)}</Text>
        <WrapperIcon isCollapse={isCollapse}>
          <Icon type="chevDown" />
        </WrapperIcon>
      </ItemActive>

      {!isCollapse && (
        <Menu>
          {items.map((item, idx) => (
            <MenuItem
              id={item.id ? item.id : ""}
              className={item.class ? item.class : ""}
              key={idx}
              onClick={() => {
                onCheckboxToggle({ index: idx, indexKey });
                setIsCollapse(true);
              }}
            >
              <Checkbox
                isChecked={item[indexKey]}
                onToggle={(e) => {
                  e.stopPropagation();
                  onCheckboxToggle({ index: idx, indexKey });
                  setIsCollapse(true);
                }}
              />
              <Text>{t(item[indexText])} </Text>
            </MenuItem>
          ))}
        </Menu>
      )}
    </Wrapper>
  );
};

export default CheckboxList;
