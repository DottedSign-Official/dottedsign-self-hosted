import React from "react";
import { i18n, useTranslation } from "next-i18next";
import { useDispatch } from "react-redux";
import { putUserLanguage as putUserLanguageAction } from "../../../../redux/actions/auth";
import languages from "../../../../constants/languages";
import Icon from "../../../Icon";
import { Wrapper, Close, Title, Body } from "../../../../global/styledModal";
import { WrapperLang, WrapperItem, Item } from "./styled";

const LangChange = ({ onModalClose }) => {
  const { t } = useTranslation("modal");
  const dispatch = useDispatch();
  const putUserLanguage = (data) => dispatch(putUserLanguageAction(data));

  const onSelect = (lang) => {
    putUserLanguage({ lang: lang.id });
  };

  return (
    <Wrapper width="700px">
      <Close onClick={onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_lang_select_title")}</Title>
      <Body id="modal-body-scrollable">
        <WrapperLang>
          {languages.map((lang, idx) => (
            <WrapperItem key={idx}>
              <Item
                onClick={() => onSelect(lang)}
                isActive={lang.id === i18n.language}
              >
                {lang.name}
              </Item>
            </WrapperItem>
          ))}
        </WrapperLang>
      </Body>
    </Wrapper>
  );
};

export default LangChange;
