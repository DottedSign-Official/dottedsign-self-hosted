import React, { useState } from "react";
import CollapseContentComp from "../../components/CollapseContent";

const CollapseContent = ({ childHead, childBody, defaultVisible }) => {
  const [isCollapse, setIsCollapse] = useState(!defaultVisible);

  const onToggle = () => {
    setIsCollapse(!isCollapse);
  };

  return (
    <CollapseContentComp
      isContent={!isCollapse}
      childHead={childHead}
      childBody={childBody}
      onToggle={onToggle}
    />
  );
};

export default CollapseContent;
