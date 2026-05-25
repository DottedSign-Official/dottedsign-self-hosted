import React from "react";
import WindowWidth from "../WindowWidth";
import Loader from "../../components/Loaders/CoverDownloadApp";
import Cover from "../../components/CoverDownloadApp";

const CoverContainer = ({ children, isMobile, windowWidth }) =>
  isMobile !== null && windowWidth !== null && windowWidth > 0 ? (
    isMobile ? (
      <Cover />
    ) : (
      children
    )
  ) : (
    <Loader />
  );

export default WindowWidth(CoverContainer);
