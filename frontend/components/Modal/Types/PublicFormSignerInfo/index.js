import React, { useState, useRef } from "react";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";
import { getPublicFormPreview as getPublicFormPreviewAction } from "../../../../redux/actions/publicForm";
import { readPublicForm as readPublicFormAction } from "../../../../redux/actions/sign";
import { isEmail } from "../../../../helpers/utility";
import Loading from "../../../LoadingComponent";
import Button from "../../../Button";
import Input from "../../../../containers/Input";
import {
  Wrapper,
  Title,
  Body,
  Content,
  Panel,
} from "../../../../global/styledModal";
import { Desc, Section, Label, ErrorHint } from "./styled";

const PublicFormSignerInfo = ({ data }) => {
  const { t } = useTranslation("modal");

  const refInput = useRef(null);
  const { form_uuid, form_token, requisite, role, title, desc } = data;
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.publicForm);
  const getPublicFormPreview = (data) =>
    dispatch(getPublicFormPreviewAction(data));
  const readPublicForm = (data) => dispatch(readPublicFormAction(data));

  const onVerify = () => {
    if (form_token) {
      const dataSend = {
        form_uuid,
        form_token,
        signer_name: userName,
        signer_email: userEmail,
      };

      readPublicForm(dataSend);
      return;
    }

    const dataSend = {
      form_uuid,
      signer_name: userName,
      signer_email: userEmail,
    };

    getPublicFormPreview(dataSend);
  };

  const isConfirmValid = (() => {
    if (isLoading) {
      return false;
    }
    if (requisite.name === "required" && userName.length < 1) {
      return false;
    }
    if (requisite.email === "required" && userEmail.length < 1) {
      return false;
    }
    if (userEmail && !isEmail(userEmail)) {
      return false;
    }
    if (isFocus) {
      return false;
    }

    return true;
  })();

  const emailError = (() => {
    if (!emailTouched) {
      return "";
    }
    if (requisite.email === "required" && userEmail.length < 1) {
      return t("public_form_email_required_hint");
    }
    if (userEmail && !isEmail(userEmail)) {
      return t("public_form_email_invalid_hint");
    }

    return "";
  })();

  const nameError =
    nameTouched && requisite.name === "required" && userName.length < 1
      ? t("public_form_name_required_hint")
      : "";

  const handleNameSubmit = (value) => {
    setUserName(value);
    setNameTouched(true);
  };

  const handleEmailSubmit = (value) => {
    setUserEmail(value);
    setEmailTouched(true);
  };

  return (
    <Wrapper width="580px">
      <Title>{title || t("modal_kiosk_signer_info_title")}</Title>
      <Body>
        <Content style={{ padding: "16px 26px 110px" }}>
          {desc && <Desc>{desc}</Desc>}

          <Section>
            <Label>{t("current_role")}</Label>
            <Input value={role} isReadOnly />
          </Section>

          <Section>
            <Label>
              {t("name")}
              {requisite.name === "required" && " *"}
            </Label>
            <Input
              value={userName}
              onSubmit={handleNameSubmit}
              placeholder={t("name_placeholder")}
            />
            {nameError && <ErrorHint>{nameError}</ErrorHint>}
          </Section>

          <Section>
            <Label>
              {t("email")}
              {requisite.email === "required" && " *"}
            </Label>
            <Input
              value={userEmail}
              refInput={refInput}
              onFocus={setIsFocus}
              onSubmit={handleEmailSubmit}
              placeholder={t("email_placeholder")}
            />
            {emailError && <ErrorHint>{emailError}</ErrorHint>}
          </Section>
        </Content>
      </Body>
      <Panel>
        <Button
          type={isConfirmValid ? "primaryFlex" : "disabled"}
          handleEvent={isConfirmValid ? onVerify : () => {}}
        >
          {isLoading ? (
            <Loading width="18px" height="18px" />
          ) : (
            t("btn_confirm")
          )}
        </Button>
      </Panel>
    </Wrapper>
  );
};

export default PublicFormSignerInfo;
