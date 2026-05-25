import React from "react";
import { useSelector } from "react-redux";
import WindowWidth from "../../containers/WindowWidth";
import Loader from "../Loaders/HeaderPanel";
import PanelDesktop from "./Panel";
import PanelMobile from "./mobile";
import { HEADER_BREAKPOINT_LG } from "../Header/styled";

const HeaderPanel = ({ windowWidth }) => {
  const isVerified = useSelector((state) => state.auth.isVerified);

  if (!windowWidth || windowWidth <= 0) {
    return <Loader />;
  }

  if (windowWidth > HEADER_BREAKPOINT_LG) {
    return <PanelDesktop isVerified={isVerified} />;
  }

  return <PanelMobile isVerified={isVerified} />;
};

export default WindowWidth(HeaderPanel);
