import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import Cookie from "js-cookie";

import Head from "../components/head";
import Toast from "../containers/Toast";
import Modal from "../containers/Modal";
import Header from "../components/Header";
import Hint from "../components/Hint";
import TaskStatusBar from "../containers/TaskStatusBar";
import TaskList from "../containers/TaskList";
import TaskPagination from "../containers/TaskPagination";
import {
  AUTH_ERROR,
  ENTERPRISE_CTA_COOKIE,
  GROUP_HINT,
  MODAL_TYPE,
} from "../constants/constants";
import { openModal } from "../redux/actions/common";
import { useLicenseHook } from "../helpers/license";
import { LICENSE_TYPE } from "../constants/licenseTypes";
import { PageWrapper, TaskWrapper } from "../global/styled";

const PageTask = () => {
  const Router = useRouter();
  const dispatch = useDispatch();
  const [hintType, setHintType] = useState(null);
  const { user, isVerified } = useSelector((state) => state.auth);
  const isEnterprise = useLicenseHook(LICENSE_TYPE.ENTERPRISE_PLAN);

  useEffect(() => {
    if (user) {
      if (!isVerified) {
        setHintType(AUTH_ERROR.needConfirm);
      } else {
        if (user.group_status === "group_expired") {
          if (user.group_roles && user.group_roles[0] === "admin") {
            setHintType(GROUP_HINT.groupExpiredAdmin);
          }
        } else {
          setHintType(null);
        }
      }
    }
  }, [user, isVerified]);

  useEffect(() => {
    if (user.isFake) {
      Router.replace("/");
    }
  }, [user, Router]);

  useEffect(() => {
    if (isEnterprise) {
      return;
    }
    if (Cookie.get(ENTERPRISE_CTA_COOKIE)) {
      return;
    }
    dispatch(openModal({ modalType: MODAL_TYPE.enterprisePlanCta }));
  }, [isEnterprise, dispatch]);

  return (
    <PageWrapper backcolor="#EEEFF3">
      <Head page="tasks" />
      <Toast />
      <Modal />
      <Hint type={hintType} />

      <Header />
      <TaskStatusBar />
      <TaskWrapper>
        <TaskList />
        <TaskPagination />
      </TaskWrapper>
    </PageWrapper>
  );
};

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      "meta",
      "common",
      "modal",
      "toast",
      "cover",
      "hint",
      "tasks",
      "create",
    ])),
  },
});

export default PageTask;
