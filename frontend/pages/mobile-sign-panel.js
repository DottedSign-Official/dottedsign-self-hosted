import Cookies from "js-cookie";
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "../components/head";
import Cover from "../components/Cover";
import Signboard from "../containers/SignBoard";
import { SIGN_PANEL } from "../constants/constants";
import { SIGNATURE_CATEGORY } from "../constants/constants";
import { PANEL_STAGE } from "../constants/signPanelTypes";
import { PageWrapper } from "../global/styled";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import WindowWidth from "../containers/WindowWidth";
import { useMobilePanelBroadcastHook } from "../helpers/socket";
import { useDispatch, useSelector } from "react-redux";
import {
  saveSign as signActions,
  saveSignGuest as saveSignGuestActions,
} from "../redux/actions/sign";
import { setPanelState } from "../redux/actions/signPanel";
import { useCheckWindowIdleHook } from "../helpers/customHooks";

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

const IdleWrapper = ({ children }) => {
  const idle = useCheckWindowIdleHook();

  return <>{idle && children}</>;
};

const EmitTimeoutOnDestroy = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    return () => dispatch(setPanelState(PANEL_STAGE.QRCODE_TIMEOUT));
  }, [dispatch]);
  return <></>;
};

const MobileSignPanel = ({ isMobile }) => {
  const router = useRouter();
  const { accessToken, uid, code, form_token, isFrontDesk, category } =
    router.query;

  if (accessToken) {
    Cookies.set("access_token", accessToken, {
      expires: new Date(Date.now() + 60 * 60 * 1000),
    });
  }

  const dispatch = useDispatch();
  const saveSign = (data) => dispatch(signActions(data));
  const saveSignGuest = (data) => dispatch(saveSignGuestActions(data));

  const isError = (!accessToken && !code && !form_token) || !uid;

  const {
    broadcastMobileConnect,
    broadcastMobileSignSuccess,
    broadcastTimeout,
  } = useMobilePanelBroadcastHook({ code, uid, form_token });
  const { isSocketConnected } = useSelector((state) => state.socket);
  const { state } = useSelector((state) => state.signPanel);
  const { publicFormUuid } = useSelector((state) => state.sign);

  useEffect(() => {
    if (!isSocketConnected) {
      return;
    }
    broadcastMobileConnect();
  }, [isSocketConnected, broadcastMobileConnect]);

  const { remoteSignatureId, remoteGuestSignature } = useSelector(
    (state) => state.signPanel,
  );
  useEffect(() => {
    if (remoteSignatureId) {
      broadcastMobileSignSuccess({ remoteSignatureId });
    }
  }, [remoteSignatureId, broadcastMobileSignSuccess]);

  useEffect(() => {
    if (remoteGuestSignature) {
      broadcastMobileSignSuccess({ remoteGuestSignature });
    }
  }, [remoteGuestSignature, broadcastMobileSignSuccess]);

  const onSignSave = (data) => {
    console.log("JJ onSignSave publicFormUuid:", publicFormUuid, form_token);
    if (code || JSON.parse(isFrontDesk) || publicFormUuid || form_token) {
      console.log("JJ onSignSave 有執行:");

      const payload = {
        raw: {
          raw: data.raw,
          base64_images: data.base64_images,
        },
        code,
        category: SIGNATURE_CATEGORY.SIGNATURE,
        file_type: "png",
        sign_stroke: data.sign_stroke,
        form_token,
      };
      saveSignGuest(payload);
    } else {
      const payload = {
        ...data,
        category: category || SIGNATURE_CATEGORY.INITIAL,
        file_type: "png",
      };
      saveSign(payload);
    }
  };

  const waitingTimeout =
    isSocketConnected || state === PANEL_STAGE.SIGN_SUCCESS;

  if (isError) {
    return <Cover type={SIGN_PANEL.connectError} isVisible />;
  }
  if (!isMobile) {
    return <Cover type={SIGN_PANEL.mobileDeviceOnly} isVisible />;
  }
  return (
    <PageWrapper backcolor="#EEEFF3">
      <Head page="mobilePanel" />
      <IdleWrapper>
        <Timer expireTime={EXPIRE_TIME} onTimeout={broadcastTimeout} />
      </IdleWrapper>

      {waitingTimeout && <EmitTimeoutOnDestroy />}
      <Signboard onSignSave={onSignSave} />
    </PageWrapper>
  );
};

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      "common",
      "meta",
      "cover",
      "settings",
    ])),
  },
});

export default WindowWidth(MobileSignPanel);
