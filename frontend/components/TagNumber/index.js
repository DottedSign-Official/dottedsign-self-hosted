import React from "react";
import Icon from "../Icon";
import { Wrapper } from "./styled";

const TagNumber = ({ indx }) => {
  if (indx !== undefined && indx !== null && indx !== false) {
    return (
      <Wrapper indx={indx % 8}>
        <Icon type="signWhite" size="20px" />
      </Wrapper>
    );
  }

  return <Wrapper />;
};

export default TagNumber;
