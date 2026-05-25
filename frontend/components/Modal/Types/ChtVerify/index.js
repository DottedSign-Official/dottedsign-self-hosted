import React, { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearChtRelated, iniSocket } from "../../../../redux/actions/socket";
import { getGraAuthorizeStatus } from "../../../../redux/actions/sign";
import { SOCKET_CHANNEL_TYPE_SIGN } from "../../../../constants/socketTypes";
import { useTranslation } from "next-i18next";
import ButtonWithLoading from "../../../ButtonWithLoading";
import Icon from "../../../Icon";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Content,
  Panel,
} from "../../../../global/styledModal";
import { Img, Text } from "./styled";
import * as commonActions from "../../../../constants/commonTypes";
import { usePageVisibility } from "../../../../helpers/customHooks";

const ChtVerify = ({
  onModalClose,
  onModalSubmit,
  data: { receiver, backup, onSend },
}) => {
  const { t } = useTranslation("modal");

  const { user } = useSelector((state) => state.auth);
  const { isLoading, isOtpFail, code, stage_id } = useSelector(
    (state) => state.sign,
  );
  const { chtApplied, chtVerified, isSocketConnected } = useSelector(
    (state) => state.socket,
  );
  const { form_token } = useSelector((state) => state.publicForm);

  const dispatch = useDispatch();
  const isVisible = usePageVisibility();

  useEffect(() => {
    return () => dispatch(clearChtRelated());
  }, [dispatch]);

  const onConfirm = useCallback(() => {
    if (onSend) {
      onSend({
        ...backup,
        data: {
          ...(backup?.data || {}),
          verify_info: {
            uuid: receiver[0].uuid,
          },
        },
      });
      return;
    }

    onModalSubmit({
      verify_info: {
        uuid: receiver[0].uuid,
      },
    });
  }, [onSend, backup, onModalSubmit, receiver]);

  const isSystemCA =
    receiver[0].verify_type === "cht_system" && !receiver[0].state;

  const isApplyNeed =
    receiver[0].state === "waiting_for_apply" &&
    receiver[0].apply_url &&
    !chtApplied;

  const isVerifyNeed = !chtVerified;

  useEffect(() => {
    if ((!isApplyNeed && !isVerifyNeed) || isSystemCA) {
      onConfirm();
    }
  }, [isApplyNeed, isVerifyNeed, isSystemCA, onConfirm]);

  useEffect(() => {
    if (isOtpFail) {
      dispatch({
        type: commonActions.OPEN_TOAST,
        data: {
          text: "system_ca_failed",
          isWarning: true,
        },
      });
      onModalClose();
    }
  }, [isOtpFail, dispatch, onModalClose]);

  useEffect(() => {
    if (!isSocketConnected) {
      if (!isSystemCA) {
        dispatch(
          iniSocket({
            code, // NOTE: quick sign code
            channelType: SOCKET_CHANNEL_TYPE_SIGN,
            form_token,
          }),
        );
      }
    }
  }, [dispatch, isSocketConnected, isSystemCA, code, form_token]);

  // NOTE: Update missed messages with getGraAuthorizeStatus due to app-switching suspensions in mobile browsers
  useEffect(() => {
    if (isVisible && stage_id) {
      dispatch(getGraAuthorizeStatus({ stage_id }));
    }
  }, [dispatch, isVisible, stage_id]);

  if (isSystemCA) {
    return (
      <Wrapper width="500px">
        <Title>{t("verify_inprocess_title", { ns: "common" })}</Title>
        <Body id="modal-body-scrollable">
          <Content center>
            <Img src="/static/images/identity/apply.png" alt="verifying-img" />
          </Content>
        </Body>
      </Wrapper>
    );
  }

  if (isApplyNeed) {
    const srcSketch = `/static/images/identity/apply.png`;
    const text = (() => {
      const textOri = t("modal_auth_verify_apply");
      const textType = textOri.replace(
        /verify_type/gi,
        t(receiver[0].verify_type),
      );
      return textType;
    })();
    const applyUrl = receiver[0].apply_url;
    const onApply = () => {
      window.open(applyUrl, "_blank");
    };

    return (
      <Wrapper width="500px">
        <Close onClick={isLoading ? () => {} : onModalClose}>
          <Icon type="cancel" />
        </Close>
        <Title>{t("modal_identity_verify_title")}</Title>
        <Body id="modal-body-scrollable">
          <Content center>
            <Img src={srcSketch} alt="apply-img" />
            <Text>{text}</Text>
            <ButtonWithLoading
              isLoading={isLoading}
              type="primaryFlex"
              handleEvent={onApply}
            >
              {t("btn_apply")}
            </ButtonWithLoading>
          </Content>
        </Body>
      </Wrapper>
    );
  }

  if (isVerifyNeed) {
    const srcSketch = `/static/images/identity/verifying.png`;
    const text = (() => {
      const textOri = t("modal_auth_verify_verifying");
      const textSigner = textOri.replace(/signer_email/gi, user.email);
      return textSigner;
    })();

    return (
      <Wrapper width="500px">
        <Title>{t("modal_identity_verify_title")}</Title>
        <Body id="modal-body-scrollable">
          <Content center>
            <Img src={srcSketch} alt="verifying-img" />
            <Text>{text}</Text>
          </Content>
        </Body>
      </Wrapper>
    );
  }

  const srcSketch = `/static/images/identity/verify-suc.svg`;
  return (
    <Wrapper width="500px">
      <Close onClick={isLoading ? () => {} : onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_identity_verify_title")}</Title>
      <Body id="modal-body-scrollable">
        <Content center>
          <Img src={srcSketch} alt="suc-img" />
          <Text>{t("modal_auth_verify_suc")}</Text>
        </Content>
      </Body>
      <Panel>
        <ButtonWithLoading
          isLoading={isLoading}
          type="primaryFlex"
          handleEvent={onConfirm}
        >
          {t("btn_send_task")}
        </ButtonWithLoading>
      </Panel>
    </Wrapper>
  );
};

const PropsValidator = (props) => {
  const {
    data: { receiver },
  } = props;
  if (!receiver || !receiver[0]) {
    return null;
  }
  return <ChtVerify {...props} />;
};

export default PropsValidator;
