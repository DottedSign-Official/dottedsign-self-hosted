import React from "react";
import { useTranslation } from "next-i18next";
import { Wrapper, Illustrate, Title, Desc } from "./styled";

const CoverAdmin = () => {
  const { t } = useTranslation("admin");
  return (
    <Wrapper>
      <Illustrate src="/static/images/404.png" alt="image-404" />
      <Title>{t("admin_block_title")}</Title>
      <Desc>{t("admin_block_desc")}</Desc>
    </Wrapper>
  );
};

export default CoverAdmin;
