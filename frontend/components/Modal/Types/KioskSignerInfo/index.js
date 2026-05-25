import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";
import { postKioskVerify as postKioskVerifyAction } from "../../../../redux/actions/sign";
import { isEmail, isTaiwanPhone as isPhone } from "../../../../helpers/utility";
import Button from "../../../Button";
import Input from "../../../../containers/Input";
import {
  Wrapper,
  Title,
  Body,
  Content,
  Panel,
} from "../../../../global/styledModal";
import { Desc, Section, Label } from "./styled";

const KioskSignerInfo = ({ data }) => {
  const { sign_task_id, signer_role, signer_requisite, task_description } =
    data;
  const [userName, setUserName] = useState("");
  const [userPhone] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.sign);
  const postKioskVerify = (data) => dispatch(postKioskVerifyAction(data));
  const { t } = useTranslation("modal");

  const onVerify = () => {
    const dataSend = {
      sign_task_id,
      signer_role,
      signer_requisite,
      actor_info: {},
    };

    if (signer_requisite.name !== "disabled") {
      dataSend.actor_info.name = userName;
    }
    if (signer_requisite.email !== "disabled") {
      dataSend.actor_info.email = userEmail;
    }
    if (signer_requisite.phone !== "disabled") {
      dataSend.actor_info.phone = userPhone;
    }

    postKioskVerify(dataSend);
  };

  const isBtnValid = (() => {
    if (isLoading) {
      return false;
    }
    if (!signer_requisite) {
      return false;
    }

    if (signer_requisite.name === "required" && userName.length < 1) {
      return false;
    }
    if (signer_requisite.email === "required" && !isEmail(userEmail)) {
      return false;
    }
    if (signer_requisite.phone === "required" && !isPhone(userPhone)) {
      return false;
    }

    return true;
  })();

  return (
    <Wrapper width="580px">
      <Title>{t("modal_kiosk_signer_info_title")}</Title>
      <Body id="modal-body-scrollable">
        <Content style={{ padding: "16px 26px 110px" }}>
          {task_description && (
            <Section>
              <Desc>{task_description}</Desc>
            </Section>
          )}

          <Section>
            <Label>{t("current_role")}</Label>
            <Input value={signer_role} onSubmit={() => {}} isReadOnly />
          </Section>

          {(signer_requisite.name === "required" ||
            signer_requisite.name === "optional") && (
            <Section>
              <Label>
                {t("name")}
                {signer_requisite.name === "required" && " *"}
              </Label>
              <Input
                value={userName}
                onSubmit={setUserName}
                placeholder={t("name_placeholder")}
              />
            </Section>
          )}

          {(signer_requisite.email === "required" ||
            signer_requisite.email === "optional") && (
            <Section>
              <Label>
                {t("email")}
                {signer_requisite.email === "required" && " *"}
              </Label>
              <Input
                value={userEmail}
                onSubmit={setUserEmail}
                placeholder={t("email_placeholder")}
              />
            </Section>
          )}
        </Content>
      </Body>
      <Panel>
        <Button
          type={isBtnValid ? "primaryFlex" : "disabled"}
          handleEvent={isBtnValid ? onVerify : () => {}}
        >
          {t("btn_confirm")}
        </Button>
      </Panel>
    </Wrapper>
  );
};

export default KioskSignerInfo;
