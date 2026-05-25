import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Head from "../../components/head";
import Toast from "../../containers/Toast";
import Modal from "../../containers/Modal";
import Hint from "../../containers/HintAdmin";
import Header from "../../components/HeaderAdmin";
import Menu from "../../components/MenuAdmin";
import TasksAdmin from "../../containers/TasksAdmin";
import ContentAdmin from "../../containers/ContentAdmin";
import Tips from "../../components/Tips";
import tips from "../../constants/tips";
import { PageWrapper } from "../../global/styled";
import {
  Wrapper,
  Frame,
  Main,
  WrapperContent,
  Content,
} from "../../global/styledAdmin";
import AdminAuthorized from "../../containers/AdminAuthorized";

const PageAdminOverview = () => (
  <PageWrapper backcolor="#EEEFF3">
    <Head page="adminTasks" />
    <Toast />
    <Modal />

    <Wrapper>
      <Frame>
        <ContentAdmin>
          <Hint />
          <Header />
          <Main>
            <Menu page="tasks" />
            <AdminAuthorized>
              <WrapperContent>
                <Content>
                  <Tips type={tips.adminTasks} />
                  <TasksAdmin />
                </Content>
              </WrapperContent>
            </AdminAuthorized>
          </Main>
        </ContentAdmin>
      </Frame>
    </Wrapper>
  </PageWrapper>
);

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      "admin",
      "common",
      "cover",
      "hint",
      "meta",
      "modal",
      "toast",
    ])),
  },
});

export default PageAdminOverview;
