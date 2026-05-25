import React, { useState, useRef } from "react";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";

import ButtonWithLoading from "../../../ButtonWithLoading";
import Icon from "../../../Icon";
import { DividerBtn } from "../../../../global/styled";
import {
  Close,
  Wrapper,
  Title,
  Body,
  Content,
  Panel,
} from "../../../../global/styledModal";

import SystemCAMemberForm from "../../../../containers/SystemCAMemberForm";

const SystemCAMember = ({ data }) => {
  const { t } = useTranslation(["modal", "admin"]);
  const { id, onPrev, members } = data;
  const { isLoading } = useSelector((state) => state.admin);

  const formRef = useRef(null);
  const [isFormValid, setIsFormValid] = useState(false);

  const handleSubmit = () => {
    if (formRef.current && isFormValid) {
      formRef.current.requestSubmit();
    }
  };

  return (
    <Wrapper width="470px">
      <Close onClick={isLoading ? null : onPrev}>
        <Icon type="previous" />
      </Close>
      <Title>
        {t("menu_ca", { ns: "admin" })}
        {t("member", { ns: "admin" })}
      </Title>
      <Body noScroll>
        <Content>
          <SystemCAMemberForm
            id={id}
            ref={formRef}
            members={members}
            setIsFormValid={setIsFormValid}
          />
        </Content>
      </Body>
      <Panel>
        <ButtonWithLoading
          isLoading={isLoading}
          type={isFormValid && !isLoading ? "cancel" : "disabled"}
          handleEvent={isFormValid ? onPrev : () => null}
        >
          {t("btn_cancel")}
        </ButtonWithLoading>
        <DividerBtn />
        <ButtonWithLoading
          isLoading={isLoading}
          type={isFormValid ? "primaryFlex" : "disabled"}
          handleEvent={isFormValid ? handleSubmit : () => null}
        >
          {t("btn_save")}
        </ButtonWithLoading>
      </Panel>
    </Wrapper>
  );
};

export default SystemCAMember;
