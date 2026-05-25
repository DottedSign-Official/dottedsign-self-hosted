import React from "react";
import { Wrapper, Back, WrapperIcon, More } from "./styled";
import Edit from "./Edit";
import Fix from "./Fix";
import Icon from "../Icon";

const SignElement = ({
  id,
  wrapperStyle,
  scaler,
  isEditable,
  isFocus,
  onFocus,
  onBlur,

  isSignAndSend,
  isRequired,
  isDate, // NOTE: global
  style,
  back,
  border,
  type,
  img, // NOTE: non-editable
  value,
  fileType, // NOTE: editable
  raw,
  idDate,
  options,
  setSignature,
  isFrontDesk,
  onMore,
}) => {
  const Comp = isEditable ? Edit : Fix;
  const fontSize = options.font_size || 14;
  const attrGlobal = {
    id,
    scaler,
    type,
    isDate,
    idDate,
    style,
    options,
    isFrontDesk,
    fontSize: `${fontSize * scaler}`,
  };

  const attrLocal = (() => {
    if (isEditable) {
      return { fileType, raw, setSignature };
    }

    if (raw) {
      return { raw, value: raw };
    }

    return { img, value };
  })();

  return (
    <Wrapper
      id={id}
      tabIndex="2"
      className="sign-component"
      style={wrapperStyle}
      isFocus={isFocus}
      onMouseDown={onFocus ? onFocus : () => {}}
      onBlur={onBlur ? onBlur : () => {}}
    >
      <Back
        isEditable={isEditable}
        isRadio={type === "checkbox" && style === 1}
        back={back}
        border={border}
      />

      {isRequired && !isSignAndSend && (
        <WrapperIcon>
          <Icon src={"/static/icons/ic-asterisk.svg"} />
        </WrapperIcon>
      )}

      <Comp {...attrGlobal} {...attrLocal} />

      {onMore && (
        <More onClick={onMore}>
          <Icon type="edit" size="10px" />
        </More>
      )}
    </Wrapper>
  );
};

export default SignElement;
