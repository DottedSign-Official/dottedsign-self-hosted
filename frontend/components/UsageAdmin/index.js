import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import LoaderLabel from "../Loaders/Label";
import Loader from "../Loaders/AdminUsage";
import Error from "../ErrorAdmin";
import { DividerBtn } from "../../global/styled";
import { Block, Label, BlockContent } from "../../global/styledAdmin";
import {
  WrapperBar,
  Indicator,
  Indx,
  BtnDetail,
  Panel,
  BtnPositive,
} from "./styled";

const UsageAdmin = ({
  onInviteUser,
  isDetail,
  isPlaceholder,
  isExpired,
  usage,
}) => {
  const { t } = useTranslation("admin");
  const router = useRouter();

  const content = () => {
    if (isPlaceholder) {
      return <Loader />;
    }

    if (isExpired) {
      return <Error type="expired" />;
    }

    return (
      <WrapperBar>
        <Indicator>
          <Indx>{t("users")}</Indx>
          <Indx>{`${usage}`}</Indx>
        </Indicator>
        {isDetail && (
          <BtnDetail onClick={() => router.push("/admin/users")}>
            {t("view_details")}
          </BtnDetail>
        )}
        <Panel>
          <BtnPositive onClick={() => onInviteUser()}>
            {t("invite_users")}
          </BtnPositive>
          <DividerBtn />
        </Panel>
      </WrapperBar>
    );
  };

  return (
    <Block width="50%">
      {isPlaceholder ? <LoaderLabel /> : <Label>{t("label_usage")}</Label>}
      <BlockContent>{content()}</BlockContent>
    </Block>
  );
};

export default UsageAdmin;
