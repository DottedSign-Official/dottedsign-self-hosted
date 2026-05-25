import React from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import AvatarCollapse from "../../containers/AvatarCollapse";
import { Wrapper, WrapperLeft, Logo, Text, WrapperRight } from "./styled";

const HeaderAdmin = ({ isDeveloper }) => {
  const { t } = useTranslation("admin");
  return (
    <Wrapper>
      <Link href="/tasks">
        <WrapperLeft href="/tasks">
          <Logo />
          <Text>
            {t(isDeveloper ? "title_developer_console" : "title_admin_console")}
          </Text>
        </WrapperLeft>
      </Link>
      <WrapperRight>
        <AvatarCollapse isAlignRight />
      </WrapperRight>
    </Wrapper>
  );
};

export default HeaderAdmin;
