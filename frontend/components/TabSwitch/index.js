import React from "react";
import { useTranslation } from "next-i18next";
import { Wrapper, Tab } from "./styled";

const TabSwitch = ({ tab, tabs, onTabChange }) => {
  const { t } = useTranslation("common");
  return (
    <Wrapper>
      {tabs.map((ta, idx) => (
        <Tab key={idx} onClick={() => onTabChange(ta)} isActive={ta === tab}>
          {t(ta.text)}
        </Tab>
      ))}
    </Wrapper>
  );
};

export default TabSwitch;
