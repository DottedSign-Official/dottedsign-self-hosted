import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "../../components/head";
import Header from "../../components/HeaderAdmin";
import Toast from "../../containers/Toast";
import Modal from "../../containers/Modal";
import Hint from "../../containers/HintAdmin";
import Menu from "../../components/MenuAdmin";
import Usage from "../../containers/UsageAdmin";

import ContentAdmin from "../../containers/ContentAdmin";
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
    <Head page="adminOverview" />
    <Modal />
    <Toast />

    <Wrapper>
      <Frame>
        <ContentAdmin>
          <Hint />
          <Header />
          <Main>
            <Menu page="overview" />
            <AdminAuthorized>
              <WrapperContent>
                <Content>
                  <Usage isDetail />
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
      "hint",
      "meta",
      "modal",
      "toast",
    ])),
  },
});

export default PageAdminOverview;
