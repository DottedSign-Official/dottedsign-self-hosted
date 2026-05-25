import React, { useState } from "react";
import CheckboxListComp from "../../components/CheckboxList";

const CheckboxList = ({
  indexKey,
  indexText,
  text,
  items,
  onCheckboxToggle,
}) => {
  const [isCollapse, setIsCollapse] = useState(true);

  const onMenuTick = () => {
    setIsCollapse(!isCollapse);
  };

  const onSelectBlur = () => {
    setIsCollapse(true);
  };

  return (
    <CheckboxListComp
      isCollapse={isCollapse}
      indexKey={indexKey}
      indexText={indexText}
      text={text}
      items={items}
      onMenuTick={onMenuTick}
      onSelectBlur={onSelectBlur}
      onCheckboxToggle={onCheckboxToggle}
      setIsCollapse={setIsCollapse}
    />
  );
};

export default CheckboxList;
