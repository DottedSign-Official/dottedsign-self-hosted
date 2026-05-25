import React from "react";
import Checkbox from "../../Checkbox";

const ColContent = ({
  isShow,
  isFixed,
  isEdit,
  links,
  keyRow,
  value,
  onUpdate,
  onInterLock,
}) => {
  if (!isShow) {
    return null;
  }

  const isChecked = value === true;

  const onToggle = () => {
    if (!isEdit) {
      return;
    }
    if (isFixed) {
      return;
    }

    const newValue = !isChecked;

    if (links && !newValue) {
      return onInterLock({
        value: newValue,
        links: [keyRow, ...links],
        hint: `modal_${keyRow}_content`,
      });
    }

    onUpdate({
      key: keyRow,
      value: newValue,
    });
  };

  return (
    <Checkbox
      isChecked={isChecked}
      isReadOnly={!isEdit || isFixed}
      onToggle={onToggle}
    />
  );
};

export default ColContent;
