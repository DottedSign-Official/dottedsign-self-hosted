import React, { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import uuid from "uuid/v1";
import { useSelector, useDispatch } from "react-redux";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { clearUser } from "../redux/actions/auth";
import { setTaskUuid, getSignTask, resetSign } from "../redux/actions/sign";
import { clearCoverType } from "../redux/actions/common";

import Head from "../components/head";
import Toast from "../containers/Toast";
import Modal from "../containers/Modal";
import PdfViewer from "../containers/PdfViewer";
import { PageWrapper } from "../global/styled";

const Pdf = () => {
  const router = useRouter();
  const { code, token, taskId, envelopeId } = router.query;
  const currentPathRef = useRef(null);
  const { t } = useTranslation("common");

  const user = useSelector((state) => state.auth.user);
  const { isFastSigning, isMyTurn, isSigningDone } = useSelector(
    (state) => state.sign,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearCoverType());
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(setTaskUuid(uuid()));
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      dispatch(getSignTask({ token }));
      return;
    }

    if (envelopeId) {
      dispatch(getSignTask({ envelopeId }));
      return;
    }

    if (taskId) {
      dispatch(getSignTask({ taskId }));
      return;
    }

    if (code) {
      dispatch(getSignTask({ code }));
      return;
    }
  }, [code, token, taskId, envelopeId, dispatch]);

  useEffect(() => {
    return () => {
      if (user && user.isFake) {
        dispatch(clearUser());
      }
    };
  }, [user, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetSign());
    };
  }, [dispatch]);

  useEffect(() => {
    const shouldHint = isMyTurn && !isSigningDone;

    if (!shouldHint) {
      return;
    }

    if (!currentPathRef.current) {
      const localePrefix = router.locale ? `/${router.locale}` : "";
      currentPathRef.current = `${localePrefix}${router.asPath}`;
    }

    const confirmationMessage = t("all_changes_discarded");

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      (e || window.event).returnValue = confirmationMessage;
      return confirmationMessage;
    };

    const popStateGuard = () => {
      const ok = window.confirm(confirmationMessage);
      if (!ok) {
        window.history.pushState(null, "", currentPathRef.current);
        return false;
      }
      return true;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    router.beforePopState(popStateGuard);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      router.beforePopState(() => true);
    };
  }, [isMyTurn, isSigningDone, router]);

  const isSSR = typeof window === "undefined";

  return (
    <PageWrapper backcolor="#EEEFF3" isLock>
      <Head page="task" />
      <Toast />
      <Modal />
      {!isSSR && <PdfViewer isGuestSign={isFastSigning} />}
    </PageWrapper>
  );
};

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      "meta",
      "common",
      "toast",
      "modal",
      "hint",
      "cover",
      "tasks",
      "settings",
      "create",
      "validations",
    ])),
  },
});

export default Pdf;
