import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Head from "../../components/head";
import Header from "../../components/HeaderAdmin";
import Menu from "../../components/MenuDeveloper";
import Toast from "../../containers/Toast";
import TasksDeveloper from "../../containers/TasksDeveloper";
import ContentAdmin from "../../containers/ContentAdmin";
import { PageWrapper } from "../../global/styled";
import {
  Wrapper,
  Frame,
  Main,
  WrapperContent,
  Content,
} from "../../global/styledAdmin";

const PageAdminOverview = () => (
  <PageWrapper backcolor="#EEEFF3">
    <Head page="developerTasks" />
    <Toast />

    <Wrapper>
      <Frame>
        <ContentAdmin>
          <Header isDeveloper />
          <Main>
            <Menu page="tasks" />
            <WrapperContent>
              <Content>
                <TasksDeveloper />
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
    ])),
  },
});

export default PageAdminOverview;
