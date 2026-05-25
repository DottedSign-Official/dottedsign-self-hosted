import React from "react";
import { useTranslation } from "next-i18next";
import tabs from "../../constants/settingTabs";
import Loader from "../Loaders/MenuSettings";
import Button from "../Button";
import { Wrapper, BtnCont, Tab } from "./styled";
import { useRouter } from "next/router";

const MenuSettings = ({ isPlaceholder, tabActive }) => {
  const Router = useRouter();
  const { t } = useTranslation("settings");

  if (isPlaceholder) {
    return <Loader />;
  }

  const ItemTab = ({ tab }) => {
    return (
      <Button handleEvent={() => Router.push(`/settings/${tab.key}`)}>
        <BtnCont isActive={tab.key === tabActive}>
          <Tab isActive={tab.key === tabActive}>{t(tab.name)}</Tab>
        </BtnCont>
      </Button>
    );
  };

  return (
    <Wrapper>
      {tabs.map((tab, idx) => (
        <ItemTab key={idx} tab={tab} />
      ))}
    </Wrapper>
  );
};

export default MenuSettings;
