import React, { useState, useEffect } from "react";
import Select from "../../components/Select";

const SelectContainer = ({
  activeItem,
  items,
  indexKey,
  indexText,
  onSelectEvent,
  isReadonly,
  isFlat,
  isSkipTrans,
}) => {
  const [isFocus, setIsFocus] = useState(false);
  const [isCollapse, setIsCollapse] = useState(true);

  useEffect(() => {
    if (isReadonly) {
      setIsCollapse(true);
    }
  }, [isReadonly]);

  const onMenuTick = () => {
    setIsCollapse(!isCollapse);

    if (!isFocus) {
      setIsFocus(true);
    }
  };

  const onSelectBlur = () => {
    setIsFocus(false);
    setIsCollapse(true);
  };

  const onItemSelect = (item) => {
    setIsCollapse(true);
    onSelectEvent(item);
  };

  return (
    <Select
      isFocus={isFocus}
      isCollapse={isCollapse}
      items={items}
      activeItem={activeItem ? activeItem : items[0]}
      indexKey={indexKey}
      indexText={indexText}
      onItemSelect={onItemSelect}
      onMenuTick={onMenuTick}
      onSelectBlur={onSelectBlur}
      isReadonly={isReadonly}
      isFlat={isFlat}
      isSkipTrans={isSkipTrans}
    />
  );
};

export default SelectContainer;
