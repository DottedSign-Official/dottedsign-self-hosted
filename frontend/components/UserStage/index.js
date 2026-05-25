import React from "react";
import Avatar from "../Avatar";
import { Wrapper, WrapperAvatar, Name, Tag, Email } from "./styled";

const EMPTY_EMAIL = "\u00A0\u00A0--";

const UserStage = ({ stage }) => {
  if (!stage) {
    return null;
  }

  return (
    <Wrapper>
      <WrapperAvatar>
        <Avatar width="32px" height="32px" src={stage.iconURL} />
      </WrapperAvatar>
      <Name>
        <Tag>{stage.name === "Me" ? "(Me)" : stage.name}</Tag>
        <Email>{stage.email ? stage.email : EMPTY_EMAIL}</Email>
      </Name>
    </Wrapper>
  );
};

export default UserStage;
