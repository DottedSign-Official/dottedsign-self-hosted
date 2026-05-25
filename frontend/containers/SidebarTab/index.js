import React, { useState } from "react";
import { useSelector } from "react-redux";
import { isExist } from "../../helpers/others";
import WindowWidth from "../WindowWidth";
import SidebarTab from "../../components/SidebarTab";
import SidebarTabMobile from "../../components/SidebarTabMobile";
import { WrapperSidebarDefault } from "./styled";

const SidebarTabContainer = ({ windowWidth }) => {
  const [isCollapse, setIsCollapse] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const { taskSummary, isLoadingAllTasks } = useSelector((state) => state.sign);
  const { isPublicForm } = useSelector((state) => state.publicForm);

  const isPlaceholder = !isExist(user);

  const onMenuToggle = () => {
    setIsCollapse(!isCollapse);
  };

  if (!windowWidth) {
    return <WrapperSidebarDefault />;
  }

  // NOTE: temporary hide mobile dropdown on public-form pages
  if (isPublicForm && windowWidth <= 768) {
    return <WrapperSidebarDefault />;
  }

  const Comp = windowWidth > 768 ? SidebarTab : SidebarTabMobile;
  let attr = {
    taskSummary,
    isLoadingAllTasks,
    isPlaceholder,
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

export default WindowWidth(SidebarTabContainer);
