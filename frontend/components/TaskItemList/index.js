import React, { useRef, useState } from "react";
import WindowWidth from "../../containers/WindowWidth";
import Flow from "../Flow";
import HintExpire from "../HintExpire";
import More from "../../containers/More";
import TagCounter from "../TagCounter";
import Icon from "../Icon";
import {
  Wrapper,
  BlockName,
  FileName,
  Sender,
  BlockFlow,
  WrapperExpire,
  BlockMore,
  WrapperEnvelopeIcon,
} from "./styled";

const TaskItemList = ({
  isMobile,
  task,
  onNav,
  isMenuUpward,
  isMoreHide,
  isDeveloper,
  isEnvelope,
}) => {
  const itemEl = useRef(null);
  const [isFocus, setIsFocus] = useState(false);

  const onMouseEnter = () => {
    if (!isFocus) {
      setIsFocus(true);
    }
  };
  const onMouseLeave = () => {
    if (isFocus) {
      setIsFocus(false);
    }
  };

  const {
    expiresDays,
    filename,
    envelopeName,
    stages,
    owner,
    moreMenu,
    tag_info,
  } = task;

  return (
    <Wrapper
      ref={itemEl}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      isFocus={isFocus}
    >
      <BlockName onClick={onNav}>
        {expiresDays && (
          <WrapperExpire>
            <HintExpire days={expiresDays} />
          </WrapperExpire>
        )}
        <FileName>{isEnvelope ? envelopeName : filename}</FileName>
        <Sender>{`${isDeveloper ? `owner:` : `Sent by`} ${owner}`}</Sender>
        <TagCounter tag_info={tag_info} />
      </BlockName>
      {!isDeveloper && (
        <BlockFlow>
          <Flow stages={stages} isList />
        </BlockFlow>
      )}
      {!isMoreHide && (isMobile || (!isMobile && isFocus)) && (
        <BlockMore>
          <More menu={moreMenu} isMenuUpward={isMenuUpward} />
        </BlockMore>
      )}

      {isEnvelope && (
        <WrapperEnvelopeIcon>
          <Icon type="envelope" size="28px" />
        </WrapperEnvelopeIcon>
      )}
    </Wrapper>
  );
};

export default WindowWidth(TaskItemList);
