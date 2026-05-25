import React from "react";
import Icon from "../Icon";
import { Input } from "../../global/styledForm";
import { Wrapper, Default } from "./styled";

const InputSwitch = ({
  isEdit,
  inputVal,
  onEditEvent,
  onChangeEvent,
  onKeyEvent,
  onBlurEvent,
}) => (
  <Wrapper>
    {isEdit ? (
      <Input
        tabIndex="56"
        value={inputVal}
        onChange={onChangeEvent}
        onKeyDown={onKeyEvent}
        onBlur={onBlurEvent}
      />
    ) : (
      <Default onClick={onEditEvent}>
        <p>{inputVal}</p>
        <Icon type="edit" />
      </Default>
    )}
  </Wrapper>
);

export default InputSwitch;
