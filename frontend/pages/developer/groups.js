import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Toast from "../../containers/Toast";
import Modal from "../../containers/Modal";
import Head from "../../components/head";
import Header from "../../components/HeaderAdmin";
import Menu from "../../components/MenuDeveloper";
import GroupDeveloper from "../../containers/GroupDeveloper";
import ContentAdmin from "../../containers/ContentAdmin";
import { PageWrapper } from "../../global/styled";
import {
  Wrapper,
  Frame,
  Main,
  WrapperContent,
  Content,
} from "../../global/styledAdmin";

const SuperAdminMember = () => (
  <PageWrapper backcolor="#EEEFF3">
    <Toast />
    <Modal />

    <Head page="developerGroups" />

    <Wrapper>
      <Frame>
        <ContentAdmin>
          <Header isDeveloper />
          <Main>
            <Menu page="groups" />
            <WrapperContent>
              <Content>
                <GroupDeveloper />
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
      "cover",
      "hint",
      "meta",
      "modal",
      "toast",
      "developer",
      "validations",
    ])),
  },
});

export default SuperAdminMember;
