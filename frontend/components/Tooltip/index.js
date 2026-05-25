import React from "react";
import { useTranslation } from "next-i18next";
import dataset from "./data";
import Icon from "../Icon";
import { Wrapper, WrapperIcon, Hint } from "./styled";

const Tooltip = ({
  type,
  position,
  isCollapse,
  onEnter,
  onLeave,
  onToggle,
}) => {
  const { t } = useTranslation("common");

  const data = dataset[type];

  return (
    <Wrapper onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <WrapperIcon onTouchStart={onToggle}>
        <Icon type={data.icon} size={data.size || "20px"} />
      </WrapperIcon>
      {!isCollapse && (
        <Hint theme={data.theme || "normal"} position={position || "bottom"}>
          {t(data.hint)}
        </Hint>
      )}
    </Wrapper>
  );
};

export default Tooltip;
