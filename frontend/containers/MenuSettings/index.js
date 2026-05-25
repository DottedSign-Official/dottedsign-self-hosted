import React, { useState } from "react";
import { useSelector } from "react-redux";
import { isExist } from "../../helpers/others";
import WindowWidth from "../WindowWidth";
import MenuSettings from "../../components/MenuSettings";
import MenuSettingsMobile from "../../components/MenuSettingsMobile";
import { WrapperMenuDefault } from "../../global/styledSettings";

const MenuSettingsContainer = ({ windowWidth, tabActive }) => {
  const [isCollapse, setIsCollapse] = useState(true);
  const { user } = useSelector((state) => state.auth);

  const isPlaceholder = !isExist(user);

  const onMenuToggle = () => {
    setIsCollapse(!isCollapse);
  };

  if (!windowWidth) {
    return <WrapperMenuDefault />;
  }

  const Comp = windowWidth > 768 ? MenuSettings : MenuSettingsMobile;
  let attr = {
    isPlaceholder,
    tabActive,
  };

  if (windowWidth <= 768) {
    attr = {
      ...attr,
      isCollapse,
      onMenuToggle,
    };
  }

  return <Comp {...attr} />;
};

export default WindowWidth(MenuSettingsContainer);
