import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import Loader from "../Loaders/MenuSettingsMobile";
import Icon from "../Icon";
import tabs from "../../constants/settingTabs";
import { Wrapper, Active, IconDown, Menu, Tab, WrapperIcon } from "./styled";

const MenuSettings = ({
  isPlaceholder,
  isCollapse,
  tabActive,
  onMenuToggle,
}) => {
  const { t } = useTranslation("settings");
  const Router = useRouter();

  if (isPlaceholder) {
    return <Loader />;
  }

  const tabCurrent = tabs.find((tab) => tab.key === tabActive);

  let textActive = "";
  if (tabCurrent !== undefined) {
    textActive = tabCurrent.name;
  }

  const ItemTab = ({ tab }) => {
    const attr = {
      button: {
        onClick: () => Router.push(`/settings/${tab.key}`),
      },
    };

    return (
      <Tab isActive={tab.key === tabActive} {...attr.button}>
        {t(tab.name)}
        {attr.iconType && (
          <WrapperIcon>
            <Icon type={attr.iconType} size="20px" />
          </WrapperIcon>
        )}
      </Tab>
    );
  };

  return (
    <Wrapper>
      <Active onClick={onMenuToggle}>
        {t(textActive)}
        <IconDown isCollapse={isCollapse}>
          <Icon type="chevDown" />
        </IconDown>
      </Active>

      {!isCollapse && (
        <Menu>
          {tabs.map((tab, idx) => (
            <ItemTab key={idx} tab={tab} />
          ))}
        </Menu>
      )}
    </Wrapper>
  );
};

export default MenuSettings;
