import React from "react";
import { i18n } from "next-i18next";
import { useDispatch } from "react-redux";
import { openModal as openModalAction } from "../../../redux/actions/common";
import languages from "../../../constants/languages";
import { MODAL_TYPE } from "../../../constants/constants";
import { ItemBtn } from "../styled";

const ItemLang = () => {
  const dispatch = useDispatch();
  const openModal = (data) => dispatch(openModalAction(data));

  const onLanguage = () => {
    openModal({ modalType: MODAL_TYPE.langChange });
  };

  const currentLang = languages.find((lang) => lang.id === i18n.language);
  const lang =
    currentLang && typeof currentLang !== "undefined"
      ? currentLang
      : languages[0];

  return <ItemBtn onClick={onLanguage}>{lang.name}</ItemBtn>;
};

export default ItemLang;
