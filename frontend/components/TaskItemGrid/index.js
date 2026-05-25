import React from "react";
import Flow from "../Flow";
import More from "../../containers/More";
import HintExpire from "../HintExpire";
import FilePreview from "../FilePreview";
import TagCounter from "../TagCounter";
import Icon from "../Icon";

import {
  Wrapper,
  Title,
  WrapperPreview,
  WrapperText,
  Filename,
  Time,
  WrapperExpire,
  WrapperMore,
  WrapperEnvelopeIcon,
} from "./styled";

const TaskItemGrid = ({ task, onNav, isEnvelope }) => {
  const {
    thumbnail,
    filename,
    envelopeName,
    createdTime,
    expiresDays,
    stages,
    moreMenu,
    tag_info,
  } = task;

  return (
    <Wrapper>
      <Title onClick={onNav}>
        <WrapperPreview>
          {isEnvelope && (
            <WrapperEnvelopeIcon>
              <Icon type="envelope" size="28px" />
            </WrapperEnvelopeIcon>
          )}
          <FilePreview thumbnail={thumbnail} />
        </WrapperPreview>
        <WrapperText>
          <Filename>{isEnvelope ? envelopeName : filename}</Filename>
          <Time>{createdTime}</Time>
          <TagCounter tag_info={tag_info} />
        </WrapperText>
      </Title>

      {expiresDays && (
        <WrapperExpire>
          <HintExpire days={expiresDays} />
        </WrapperExpire>
      )}

      <Flow stages={stages} />
      <WrapperMore>
        <More menu={moreMenu} />
      </WrapperMore>
    </Wrapper>
  );
};

export default TaskItemGrid;
