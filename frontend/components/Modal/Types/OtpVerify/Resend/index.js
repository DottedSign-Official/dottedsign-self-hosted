import React, { useState, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "next-i18next";
import { useInterval } from "../../../../../helpers/customHooks";
import { Wrapper, Counter, Btn } from "./styled";

const EXPIRE_TIME = 60 * 10 * 1e3;

const Resend = ({ onResend }) => {
  const { t } = useTranslation("modal");

  const targetTime = useRef(null);
  const [countdown, setCountdown] = useState(EXPIRE_TIME);
  const [delay, setDelay] = useState(1000);

  useEffect(() => {
    onTimerStart();
  }, []);

  useInterval(() => {
    const remainingTime = targetTime.current - Date.now();
    setCountdown(remainingTime);

    if (remainingTime <= 0) {
      setDelay(null);
      targetTime.current = null;
      setCountdown(0);
    }
  }, delay);

  const onTimerStart = () => {
    targetTime.current = Date.now() + EXPIRE_TIME;
    setDelay(1000);
  };

  const onOtpResend = () => {
    onResend();
    onTimerStart();
  };

  const minute = useMemo(
    () => Math.floor((countdown % (1000 * 60 * 60)) / (1000 * 60)),
    [countdown],
  );
  const second = useMemo(
    () => Math.floor((countdown % (1000 * 60)) / 1000),
    [countdown],
  );

  return (
    <Wrapper>
      {countdown ? (
        <>
          {t("modal_otp_hint_wait")}
          <Counter>{`${minute}:${String(second).padStart(2, "0")}`}</Counter>
        </>
      ) : (
        <>
          {t("modal_otp_hint")}
          <Btn onClick={onOtpResend}>{t("btn_resend")}</Btn>
        </>
      )}
    </Wrapper>
  );
};

export default Resend;
