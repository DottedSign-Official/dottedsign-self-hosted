import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import uuid from "uuid/v4";

import { useTranslation } from "next-i18next";
import { setURL, setPanelState } from "../../redux/actions/signPanel";
import Code from "../../components/QRcode";
import QRcodeLoading from "../../components/QRcode/Loading";
import Timeout from "../../components/QRcode/Timeout";
import SignSucc from "../../components/QRcode/SignSuccess";
import WindowWidth from "../WindowWidth";
import { BtnMobileSignPanel } from "./styled";
import { PANEL_STAGE } from "../../constants/signPanelTypes";
import { useMobilePanelBroadcastHook } from "../../helpers/socket";
import * as commonActions from "../../constants/commonTypes";
import toastStatus from "../../constants/toast";

const EXPIRE_TIME = 60e3;

const Timer = ({ expireTime, onTimeout }) => {
  const refTimer = useRef(null);
  useEffect(() => {
    refTimer.current = setTimeout(() => {
      onTimeout();
    }, [expireTime]);

    return () => {
      if (refTimer.current) {
        clearTimeout(refTimer.current);
      }
    };
  }, [expireTime, onTimeout]);

  return <></>;
};

const QRCodeWithWebSocket = ({ isWaitingRemote, category }) => {
  const { t, i18n } = useTranslation("settings");
  const { isFastSigning } = useSelector((state) => state.sign);

  const [uid] = useState(uuid());
  const router = useRouter();
  const { code } = router.query;

  const dispatch = useDispatch();
  const { isLoading, qrcodeURL } = useSelector((state) => state.signPanel);
  const isFrontDesk = useSelector((state) => state.auth.isFrontDesk);
  const { isPublicForm } = useSelector((state) => state.sign);
  const { form_token } = useSelector((state) => state.publicForm);

  const { broadcastTimeout } = useMobilePanelBroadcastHook({
    uid,
    code,
    form_token,
  });
  useEffect(() => {
    dispatch(
      setURL({
        isFrontDesk,
        uid,
        code,
        language: i18n.language,
        category,
        ...(isPublicForm && form_token ? { form_token } : {}),
      }),
    );
  }, [
    isFrontDesk,
    uid,
    code,
    form_token,
    isPublicForm,
    i18n.language,
    dispatch,
    category,
  ]);

  if (isWaitingRemote) {
    return <QRcodeLoading t={t} />;
  }

  return (
    <>
      {!isLoading && (
        <Timer expireTime={EXPIRE_TIME} onTimeout={broadcastTimeout} />
      )}
      <Code
        t={t}
        isFastSigning={isFastSigning}
        expireTime={EXPIRE_TIME}
        isLoading={isLoading}
        qrcodeURL={qrcodeURL}
      />
    </>
  );
};

const QRcodeButton = ({ children }) => {
  const dispatch = useDispatch();

  const openQRcode = () => dispatch(setPanelState(PANEL_STAGE.QRCODE));

  return (
    <BtnMobileSignPanel onClick={openQRcode}>{children}</BtnMobileSignPanel>
  );
};

const SignBoardWithQRcode = WindowWidth(
  ({ children, isMobile, onClose, category }) => {
    const { t } = useTranslation("settings");

    const dispatch = useDispatch();
    const { state } = useSelector((state) => state.signPanel);

    useEffect(() => {
      return () => dispatch(setPanelState(PANEL_STAGE.SIGN_BROAD));
    }, [dispatch]);

    useEffect(() => {
      if (!isMobile && state === PANEL_STAGE.SIGN_SUCCESS) {
        onClose();
        dispatch({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.signSaveSuc,
        });
      }
    }, [state, dispatch, onClose, isMobile]);

    if (isMobile) {
      switch (state) {
        case PANEL_STAGE.SIGN_SUCCESS:
          return <SignSucc t={t} isMobile />;
        case PANEL_STAGE.QRCODE_TIMEOUT:
          return <Timeout t={t} isMobile />;
      }
    } else {
      switch (state) {
        case PANEL_STAGE.QRCODE_TIMEOUT:
          return (
            <Timeout
              t={t}
              onReset={() => dispatch(setPanelState(PANEL_STAGE.QRCODE))}
            />
          );
        case PANEL_STAGE.WAIT_REMOTE_SIGN:
          return (
            <QRCodeWithWebSocket isWaitingRemote={true} category={category} />
          );
        case PANEL_STAGE.QRCODE:
          return (
            <QRCodeWithWebSocket isWaitingRemote={false} category={category} />
          );
      }
    }
    return children;
  },
);

export { SignBoardWithQRcode, QRcodeButton };
