import React from "react";
import InputRole from "../../components/InputRole";

const InputRoleContainer = ({
  index,
  item,
  onModify,
  onParentFocus,
  isReadOnly,
}) => {
  const onInputClick = () => {
    onParentFocus(item);
  };

  const onInputChange = (e) => {
    if (isReadOnly) {
      return;
    }
    const val = e.target.value;
    onModify({
      ...item,
      role: val,
    });
  };

  const onInputBlur = () => {
    onParentFocus(null);
  };

  return (
    <InputRole
      index={index}
      input={item && item.role ? item.role : ""}
      onInputClick={onInputClick}
      onInputChange={onInputChange}
      onInputBlur={onInputBlur}
      isReadOnly={isReadOnly}
    />
  );
};

export default InputRoleContainer;
