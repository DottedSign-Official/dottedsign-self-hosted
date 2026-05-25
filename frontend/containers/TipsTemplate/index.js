import React from "react";
import { useSelector } from "react-redux";
import tips from "../../constants/tips";
import Tips from "../../components/Tips";

const TipsTemplate = () => {
  const { templatesCount, templatesShareCount } = useSelector(
    (state) => state.template,
  );

  if (templatesCount === null || templatesShareCount === null) {
    return <Tips isPlaceholder />;
  }

  return <Tips type={tips.settingsTemplate} />;
};

export default TipsTemplate;
