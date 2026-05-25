import React from "react";
import Link from "next/link";
import { GlobalBtn, GlobalLink } from "../../global/styledBtn";

const Button = ({
  tabIndex,
  id,
  className,
  type,
  btnStyle,
  handleEvent,
  url,
  target,
  children,
}) => {
  let BtnElem;
  let BtnAttr = {};

  BtnAttr.tabIndex = tabIndex ? tabIndex : "2020";
  if (id) {
    BtnAttr.id = id;
  }
  if (className) {
    BtnAttr.className = className;
  }
  if (type) {
    BtnAttr.theme = type;
  }
  if (btnStyle) {
    BtnAttr.style = btnStyle;
  }
  if (url) {
    BtnAttr.href = url;
  }
  if (target) {
    BtnAttr.target = target;
    BtnAttr.rel = "noopener noreferrer";
  }

  // NOTE: internal link
  if (url && !target) {
    return (
      <Link href={url}>
        <GlobalBtn {...BtnAttr}>{children}</GlobalBtn>
      </Link>
    );
  }

  // NOTE: button
  if (handleEvent) {
    BtnElem = GlobalBtn;
    BtnAttr.onClick = handleEvent;
  }

  // NOTE: external link
  if (url && target) {
    BtnElem = GlobalLink;
  }

  // NOTE: default
  if (!handleEvent && !url) {
    BtnElem = GlobalBtn;
  }

  if (!BtnElem) {
    return null;
  }
  return <BtnElem {...BtnAttr}>{children}</BtnElem>;
};

export default Button;
