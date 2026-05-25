import React, { useState } from "react";
import SelectMultiComponent from "../../components/SelectMulti";

const SelectMulti = ({
  options,
  optionsActive,
  objKey,
  placeholder,
  onUpdate,
  isUpward,
  isLightTheme,
  target,
}) => {
  const [isCollapse, setIsCollapse] = useState(true);

  const onToggleEvent = (e) => {
    const detector = document.getElementsByClassName("toggle-detect");

    for (let i = 0; i < detector.length; i++) {
      if (e.target.contains(detector[i])) {
        setIsCollapse(!isCollapse);
        return null;
      }
    }
  };

  const onBlurEvent = () => {
    setIsCollapse(true);
  };

  const onSelectEvent = (opt) => {
    onUpdate("add", opt);
  };

  const onDeleteEvent = (opt) => {
    onUpdate("delete", opt);
  };

  return (
    <SelectMultiComponent
      placeholder={placeholder}
      isUpward={isUpward}
      isLightTheme={isLightTheme}
      isCollapse={isCollapse}
      objKey={objKey}
      options={options}
      optionsActive={optionsActive}
      target={target}
      onToggle={onToggleEvent}
      onBlur={onBlurEvent}
      onSelect={onSelectEvent}
      onDelete={onDeleteEvent}
    />
  );
};

export default SelectMulti;
