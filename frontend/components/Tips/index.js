import React from "react";
import { useTranslation } from "next-i18next";
import Loader from "../Loaders/Tips";
import Icon from "../Icon";
import dataset from "./data";
import { Wrapper } from "./styled";

const Tips = ({ type, isPlaceholder }) => {
  const { t } = useTranslation("common");

  if (isPlaceholder) {
    return <Loader />;
  }

  if (!type) {
    return null;
  }

  const text = dataset[type];

  return (
    <Wrapper>
      <Icon type="tips" />
      <p>{t(text)}</p>
    </Wrapper>
  );
};

export default Tips;
