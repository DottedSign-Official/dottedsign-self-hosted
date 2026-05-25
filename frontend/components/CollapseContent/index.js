import React from "react";
import Icon from "../Icon";
import {
  Wrapper,
  WrapperHeader,
  WrapperIcon,
  WrapperTitle,
  WrapperContent,
} from "./styled";

const CollapseContent = ({ isContent, childHead, childBody, onToggle }) => (
  <Wrapper>
    <WrapperHeader>
      <WrapperIcon isContent={isContent} onClick={onToggle}>
        <Icon type="chevDown" size="20px" />
      </WrapperIcon>
      <WrapperTitle>{childHead}</WrapperTitle>
    </WrapperHeader>
    <WrapperContent isContent={isContent}>{childBody}</WrapperContent>
  </Wrapper>
);

export default CollapseContent;
