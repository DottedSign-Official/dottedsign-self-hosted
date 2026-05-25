import React from "react";
import Avatar from "../../Avatar";
import UserStatus from "../../UserStatus";
import { HeadItem, WrapperStatus, WrapperHead, Name } from "./styled";

const Item = ({ isList, step }) => (
  <HeadItem isList={isList}>
    <WrapperStatus>
      <UserStatus text={step.statusText} color={step.statusColor} />
    </WrapperStatus>
    <WrapperHead isList={isList}>
      <Avatar width="100%" height="100%" src={step.iconURL} isNoMargin />
    </WrapperHead>
    <Name color={step.nameColor}>{step.name}</Name>
  </HeadItem>
);

export default Item;
