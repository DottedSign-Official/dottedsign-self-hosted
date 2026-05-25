import React from "react";
import WindowWidth from "../WindowWidth";
import CoverAdmin from "../../components/CoverAdmin";

const ContentAdmin = ({ children, isMobile }) => {
  return isMobile ? <CoverAdmin /> : children;
};

export default WindowWidth(ContentAdmin);
