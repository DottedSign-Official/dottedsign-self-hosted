import React from "react";
import { useTranslation } from "next-i18next";
import { BtnPositive, BtnNegative, DividerBtn } from "./styled";

const BtnContent = ({ isEdit, onEdit, onConfirm, onCancel }) => {
  const { t } = useTranslation("admin");

  if (!isEdit) {
    return <BtnPositive onClick={onEdit}>{t("edit")}</BtnPositive>;
  }

  return (
    <>
      <BtnNegative onClick={onConfirm}>{t("confirm")}</BtnNegative>
      <DividerBtn />
      <BtnPositive onClick={onCancel}>{t("cancel")}</BtnPositive>
    </>
  );
};

export default BtnContent;
