import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Head from "../../components/head";
import Toast from "../../containers/Toast";
import Modal from "../../containers/Modal";
import Hint from "../../containers/HintAdmin";
import Header from "../../components/HeaderAdmin";
import Menu from "../../components/MenuAdmin";
import Organization from "../../containers/OrganizationAdmin";

import ContentAdmin from "../../containers/ContentAdmin";
import { PageWrapper } from "../../global/styled";
import {
  Wrapper,
  Frame,
  Main,
  WrapperContent,
  Content,
} from "../../global/styledAdmin";

const PageAdminOrganization = () => (
  <PageWrapper backcolor="#EEEFF3">
    <Head page="adminOrganization" />
    <Toast />
    <Modal />

    <Wrapper>
      <Frame>
        <ContentAdmin>
          <Hint />
          <Header />
          <Main>
            <Menu page="organization" />
            <WrapperContent>
              <Content>
                <Organization />
              </Content>
            </WrapperContent>
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
      "create",
    ])),
  },
});

export default PageAdminOrganization;
