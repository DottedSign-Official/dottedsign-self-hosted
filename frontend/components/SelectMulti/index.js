import React from "react";
import Icon from "../Icon";
import {
  Wrapper,
  WrapperInput,
  WrapperItems,
  Itm,
  ItmDelete,
  Holder,
  WrapperChevron,
  Menu,
  MenuItm,
} from "./styled";

const SelectMulti = ({
  placeholder,
  isUpward,
  isLightTheme,
  isCollapse,
  objKey,
  options,
  optionsActive,
  onToggle,
  onBlur,
  onSelect,
  onDelete,
  target,
}) => (
  <Wrapper
    tabIndex="99"
    onClick={onToggle}
    onBlur={onBlur}
    isLightTheme={isLightTheme}
    target={target}
  >
    <WrapperInput>
      <WrapperItems>
        {optionsActive && optionsActive.length > 0 ? (
          optionsActive.map((option, idx) => (
            <Itm key={idx}>
              {objKey ? option[objKey] : option}
              <ItmDelete onClick={() => onDelete(option)}>
                <Icon type="cancelBlack" size="12px" />
              </ItmDelete>
            </Itm>
          ))
        ) : (
          <Holder className="toggle-detect">{placeholder}</Holder>
        )}
      </WrapperItems>
      <WrapperChevron isCollapse={isCollapse}>
        <Icon type="chevDown" className="toggle-detect" />
      </WrapperChevron>
    </WrapperInput>

    {!isCollapse && (
      <Menu isUpward={isUpward}>
        {options &&
          options.length > 0 &&
          options.map((option, idx) => {
            const isActive =
              optionsActive &&
              optionsActive.find((opt) => opt === option) !== undefined;

            return (
              <MenuItm
                key={idx}
                isActive={isActive}
                onClick={isActive ? null : () => onSelect(option)}
              >
                {objKey ? option[objKey] : option}
              </MenuItm>
            );
          })}
      </Menu>
    )}
  </Wrapper>
);

export default SelectMulti;
