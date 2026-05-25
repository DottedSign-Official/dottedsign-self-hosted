import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Head from "../components/head";
import Toast from "../containers/Toast";
import Modal from "../containers/Modal";
import Header from "../components/Header";
import Hint from "../components/Hint";

import { AUTH_ERROR, GROUP_HINT } from "../constants/constants";
import SidebarTab from "../containers/SidebarTab";
import PublicFormMain from "../containers/PublicFormMain";

import { PageWrapper } from "../global/styled";
import { WrapperSetting } from "../global/styledSettings";
import {
  setIsPublicForm as setIsPublicFormAction,
  setTabActive as setTabActiveAction,
} from "../redux/actions/publicForm";
import { getPublicFormTasks as getPublicFormTasksAction } from "../redux/actions/sign";

const PagePublicForm = () => {
  const dispatch = useDispatch();
  const [hintType, setHintType] = useState(null);
  const { user, isVerified } = useSelector((state) => state.auth);
  const setIsPublicForm = (data) => dispatch(setIsPublicFormAction(data));
  const setTabActive = (data) => dispatch(setTabActiveAction(data));
  const getPublicFormTasks = (data) => dispatch(getPublicFormTasksAction(data));

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
    setIsPublicForm(true);
    setTabActive("my_public_forms");
    getPublicFormTasks();
    return () => {
      setIsPublicForm(false);
    };
  }, []);

  return (
    <PageWrapper>
      <Head page="publicForms" />
      <Toast />
      <Modal />
      <Hint type={hintType} />

      <Header />
      <WrapperSetting>
        <SidebarTab />
        <PublicFormMain />
      </WrapperSetting>
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
      "publicForm",
      "settings",
    ])),
  },
});

export default PagePublicForm;
