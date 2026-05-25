import React from "react";
import { useTranslation } from "next-i18next";
import Icon from "../Icon";
import {
  Wrapper,
  ItemActive,
  Text,
  WrapperIcon,
  Menu,
  MenuItem,
} from "./styled";

const Select = ({
  isFocus,
  isCollapse,
  items,
  activeItem,
  indexKey,
  indexText,
  onItemSelect,
  onMenuTick,
  onSelectBlur,
  isReadonly,
  isFlat,
  isSkipTrans,
}) => {
  const { t } = useTranslation("common");

  return (
    <Wrapper tabIndex="5566123" onBlur={onSelectBlur}>
      <ItemActive
        isReadonly={isReadonly}
        isFocus={isFocus}
        onClick={isReadonly ? () => {} : onMenuTick}
        isFlat={isFlat}
      >
        <Text>
          {isSkipTrans ? activeItem[indexText] : t(activeItem[indexText])}
        </Text>

        {!isReadonly && (
          <WrapperIcon isCollapse={isCollapse}>
            <Icon type="chevDown" />
          </WrapperIcon>
        )}
      </ItemActive>

      {!isCollapse && (
        <Menu>
          {items.map((item, idx) => (
            <MenuItem
              id={item.id ? item.id : ""}
              className={item.class ? item.class : ""}
              key={idx}
              onClick={item.isLabel ? null : () => onItemSelect(item)}
              isActive={item[indexKey] === activeItem[indexKey]}
              isLabel={item.isLabel}
            >
              {isSkipTrans ? item[indexText] : t(item[indexText])}
            </MenuItem>
          ))}
        </Menu>
      )}
    </Wrapper>
  );
};

export default Select;
