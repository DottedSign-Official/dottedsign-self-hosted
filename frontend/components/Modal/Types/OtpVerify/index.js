import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";
import { postOtpResend as postOtpResendAction } from "../../../../redux/actions/sign";
import ButtonWithLoading from "../../../ButtonWithLoading";
import VerificationCodeInput from "../../../VerificationCodeInput";
import Resend from "./Resend";
import { Wrapper, Title, Body, Panel } from "../../../../global/styledModal";
import { Content, Img, Text, OtpError } from "./styled";

const OTP_LENGTH = 6;
const OtpVerify = ({ onModalSubmit, data: { receiver, backup, onSend } }) => {
  const { t } = useTranslation("modal");

  const [otpCode, setOtpCode] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const isLoading = useSelector((state) => state.sign.isLoading);
  const taskId = useSelector((state) => state.sign.task_id);
  const owner = useSelector((state) => state.sign.owner);
  const isOtpFail = useSelector((state) => state.sign.isOtpFail);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const postOtpResend = (data) => dispatch(postOtpResendAction(data));

  useEffect(() => {
    let timer;

    if (receiver) {
      timer = setTimeout(() => {
        receiver.map((rec) => {
          if (rec.verify_type === "sms") {
            const otp_tel = document.getElementById("otp-tel");
            if (otp_tel) {
              otp_tel.innerHTML = rec.verify_source;
            }
          } else if (rec.verify_type === "email") {
            const otp_email = document.getElementById("otp-email");
            if (otp_email) {
              otp_email.innerHTML = rec.verify_source;
            }
          }
        });

        if (owner) {
          const otp_sender = document.getElementById("otp-sender");
          if (otp_sender) {
            otp_sender.innerHTML = owner;
          }
        }
      }, 500);
    }
    return () => clearTimeout(timer);
  }, [owner, receiver]);

  useEffect(() => {
    const isCompleteCode =
      otpCode && !Number.isNaN(otpCode) && otpCode.length === OTP_LENGTH;
    setIsFormValid(isCompleteCode);
  }, [otpCode]);

  const onChange = (val) => setOtpCode(val);
  const onResend = () => {
    postOtpResend({
      sign_task_id: taskId,
      uuid: receiver[0].uuid,
      signer_email: user.email,
    });
  };

  const onConfirm = () => {
    if (onSend) {
      const newData = {
        ...backup,
        data: {
          ...backup.data,
          verify_info: {
            uuid: receiver[0].uuid,
            verify_data: otpCode,
          },
        },
      };

      onSend(newData);
      return;
    }

    onModalSubmit({
      verify_info: {
        uuid: receiver[0].uuid,
        verify_data: otpCode,
      },
    });
  };

  const descType =
    receiver && receiver.length > 0
      ? receiver.length === 2
        ? "modal_otp_desc_both"
        : receiver[0].verify_type === "sms"
        ? "modal_otp_desc_phone"
        : "modal_otp_desc_email"
      : "modal_otp_desc_warn";

  return (
    <Wrapper width="500px">
      <Title>{t("modal_otp_title")}</Title>
      <Body id="modal-body-scrollable">
        <Content center>
          <Img src="/static/images/verification.png" alt="otp-img" />
          <Text dangerouslySetInnerHTML={{ __html: t(descType) }} />
          <VerificationCodeInput
            autoFocus
            value={otpCode}
            onChange={onChange}
            length={OTP_LENGTH}
          />
          {isOtpFail && (
            <OtpError>
              <span>{t("modal_otp_error")}</span>
            </OtpError>
          )}
          <Resend onResend={onResend} />
        </Content>
      </Body>
      <Panel>
        <ButtonWithLoading
          isLoading={isLoading}
          type={isFormValid ? "primaryFlex" : "disabled"}
          handleEvent={isFormValid ? onConfirm : null}
        >
          {t("btn_confirm")}
        </ButtonWithLoading>
      </Panel>
    </Wrapper>
  );
};

export default OtpVerify;
