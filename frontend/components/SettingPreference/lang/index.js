import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import Tooltip from "../../../containers/Tooltip";
import Select from "../../../containers/Select";
import tooltip from "../../../constants/tooltip";
import { supportedLangMail } from "../../../constants/languages";
import {
  WrapperItem,
  ItemLabel,
  ItemDesc,
  WrapperSelect,
} from "../../../global/styledSettings";

const SettingPreferenceLang = ({ isEdit, preference, onUpdate }) => {
  const { t } = useTranslation("settings");

  const [defaultLang, setDefaultLang] = useState(null);

  useEffect(() => {
    if (preference && preference.receiver_lang) {
      const lang = preference.receiver_lang?.toLowerCase();
      setDefaultLang(
        supportedLangMail.find((lan) => lan.id === lang) ||
          supportedLangMail[0],
      );
    } else {
      setDefaultLang(supportedLangMail[0]);
    }
  }, [preference]);

  const onLangSelect = (item) => {
    onUpdate({ receiver_lang: item.id });
  };

  return (
    <WrapperItem data-testid="language_block">
      <ItemLabel>
        {t("settings_preference_lang")}&nbsp;
        <Tooltip type={tooltip.receiverLang} />
      </ItemLabel>
      <ItemDesc>
        <WrapperSelect>
          <Select
            activeItem={defaultLang}
            items={supportedLangMail}
            indexKey="key"
            indexText="name"
            onSelectEvent={onLangSelect}
            isReadonly={!isEdit}
          />
        </WrapperSelect>
      </ItemDesc>
    </WrapperItem>
  );
};

export default SettingPreferenceLang;
