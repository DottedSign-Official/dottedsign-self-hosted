import React, { useRef, useEffect } from "react";
import Icon from "../Icon";
import onBlur from "../../helpers/onBlur";
import Menu from "./Menu";
import {
  Wrapper,
  WrapperLabels,
  Label,
  WrapperButton,
  WrapperMenu,
} from "./styled";

const ListTag = ({
  labels,
  labelFocus,
  onTagClick,
  onClear,
  isExpand,
  onExpand,
  onClose,
}) => {
  const timerRef = useRef();

  useEffect(() => {
    const timer = timerRef;
    return () => clearTimeout(timer.current);
  }, []);

  const onToggle = () => {
    if (isExpand) {
      return onClose();
    }

    return onExpand();
  };

  const onBlurEvent = (e) => {
    clearTimeout(timerRef.current);
    onBlur(timerRef, () => onClose())(e);
  };

  if (!labels) {
    return null;
  }

  const panel = () => {
    if (labels && labels.length > 0) {
      return (
        <>
          <WrapperLabels>
            {labels.map((tag, idx) => (
              <Label
                key={idx}
                onClick={() => onTagClick(tag)}
                isFocus={labelFocus.indexOf(tag) > -1}
              >
                <span>{tag}</span>
              </Label>
            ))}
          </WrapperLabels>

          <WrapperButton isExpand={isExpand} onClick={onToggle}>
            <Icon type="chevDown" size="20px" />
          </WrapperButton>
        </>
      );
    }

    return null;
  };

  return (
    <Wrapper tabIndex={999} onBlur={onBlurEvent}>
      {panel()}

      {isExpand && (
        <WrapperMenu>
          <Menu
            labels={labels}
            labelFocus={labelFocus}
            onTagClick={onTagClick}
            onClear={onClear}
          />
        </WrapperMenu>
      )}
    </Wrapper>
  );
};

export default ListTag;
