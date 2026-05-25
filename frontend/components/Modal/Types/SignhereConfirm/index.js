import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import {
  putSignTask as putSignTaskAction,
  putKioskSign as putKioskSignAction,
  putPublicFormSign as putPublicFormSignAction,
} from "../../../../redux/actions/sign";
import ButtonWithLoading from "../../../ButtonWithLoading";
import Icon from "../../../Icon";
import { DividerBtn } from "../../../../global/styled";

import {
  Wrapper,
  Close,
  Title,
  Body,
  Content,
  Panel,
} from "../../../../global/styledModal";

import { Text } from "./styled";

const SignhereConfirm = ({ onModalClose }) => {
  const { t } = useTranslation("modal");
  const router = useRouter();
  const { query } = router;

  const {
    isLoading,
    task_id,
    envelope_id,
    stage_id,
    appliedSigns,
    isEnvelope,
  } = useSelector((state) => state.sign);
  const { isFrontDesk, isPublicFormSigning } = useSelector(
    (state) => state.auth,
  );
  const dispatch = useDispatch();
  const putSignTask = (data) => dispatch(putSignTaskAction(data));
  const putKioskSign = (data) => dispatch(putKioskSignAction(data));
  const putPublicFormSign = () => dispatch(putPublicFormSignAction());

  const onConfirm = () => {
    const accessToken = Cookies.get("access_token");

    if (isFrontDesk) {
      putKioskSign({
        task_id,
        signs: appliedSigns,
        stage_id,
        isFrontDesk,
        dispatch,
      });
      return;
    }

    if (isPublicFormSigning) {
      putPublicFormSign();
      return;
    }

    putSignTask({
      ...(isEnvelope ? { envelope_id } : { task_id }),
      signs: appliedSigns,
      stage_id,
      code: query.code,
      accessToken,
    });
  };

  return (
    <Wrapper width="470px">
      <Close onClick={isLoading ? null : onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_task_confirm_title")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          <Text>{t("modal_task_confirm_content")}</Text>
        </Content>
      </Body>
      <Panel>
        <ButtonWithLoading
          isLoading={isLoading}
          type="cancel"
          handleEvent={onModalClose}
        >
          {t("btn_cancel")}
        </ButtonWithLoading>
        <DividerBtn />
        <ButtonWithLoading
          isLoading={isLoading}
          type="primaryFlex"
          handleEvent={onConfirm}
        >
          {t("btn_confirm")}
        </ButtonWithLoading>
      </Panel>
    </Wrapper>
  );
};

export default SignhereConfirm;
