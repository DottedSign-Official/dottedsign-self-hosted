import React from "react";
import Icon from "../../../Icon";
import { Wrapper, Content } from "./styled";

const contentCheckbox = (isChecked, isRadio) => {
  if (!isChecked) {
    return null;
  }

  if (isRadio) {
    return <Content className="radio-is-check" isRadio />;
  }

  return <Icon type="checkedSingle" size="100%" />;
};

const CheckBox = ({ isEdit, isChecked, setSignature, style }) => {
  const onToggle = () => {
    setSignature({
      category: "checkbox",
      style,
      raw: !isChecked,
    });
  };

  const isRadio = style === 1;

  return (
    <Wrapper
      className="chkbox"
      isRadio={isRadio}
      onClick={isEdit ? onToggle : () => {}}
    >
      {contentCheckbox(isChecked, isRadio)}
    </Wrapper>
  );
};

export default CheckBox;
