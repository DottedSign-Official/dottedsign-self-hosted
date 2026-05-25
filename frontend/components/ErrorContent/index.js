import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import Btn from "../Button";
import { Wrapper, Title, SubTitle, Sketch, BtnWrapper } from "./styled";

const ErrorContent = () => {
  const { t } = useTranslation("common");
  const user = useSelector((state) => state.auth.user);

  return (
    <Wrapper>
      <Title>{t("error_title")}</Title>
      <SubTitle dangerouslySetInnerHTML={{ __html: t("error_desc") }} />
      <Sketch src="/static/images/404.png" alt="img-not-found" />
      <BtnWrapper>
        <Btn type="primary" url={user ? "/tasks" : "/"}>
          {t("error_btn")}
        </Btn>
      </BtnWrapper>
    </Wrapper>
  );
};

export default ErrorContent;
