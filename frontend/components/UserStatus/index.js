import React from "react";
import { useTranslation } from "next-i18next";
import { Status } from "./styled";

const UserStatus = ({ color, text }) => {
  const { t } = useTranslation("common");
  return <Status color={color}>{t(text)}</Status>;
};

export default UserStatus;
