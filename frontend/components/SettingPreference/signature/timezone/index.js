import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import Select from "../../../../containers/Select";
import data, { getTabByLang } from "./data";
import {
  WrapperItem,
  ItemLabel,
  ItemDesc,
  WrapperSelect,
} from "../../../../global/styledSettings";

const OPTION_KEY = "key";
const OPTION_TEXT = "text";

const Timezone = ({ value, onUpdate, isReadOnly }) => {
  const { t, i18n } = useTranslation("settings");
  const [options, setOptions] = useState(null);
  const [optionActive, setOptionActive] = useState(null);

  useEffect(() => {
    const currentLanguage = i18n?.language || "en";
    const isZh = currentLanguage === "zh-tw" || currentLanguage === "zn-cn";

    const opts = Object.keys(data).reduce((acc, key) => {
      const label = key;
      const itemsObj = data[key];

      const optLabel = {
        [OPTION_KEY]: label,
        [OPTION_TEXT]: getTabByLang(label, isZh),
        isLabel: true,
      };

      const optsItems = Object.keys(itemsObj).map((keyItem) => ({
        [OPTION_KEY]: keyItem,
        [OPTION_TEXT]: `${itemsObj[keyItem][isZh ? "zh" : "common"]} (UTC${
          itemsObj[keyItem].utc
        })`,
      }));

      return [...acc, optLabel, ...optsItems];
    }, []);

    setOptions(opts);
  }, [i18n?.language]);

  useEffect(() => {
    if (!options) {
      return;
    }

    if (!value) {
      onUpdate("Asia/Taipei");
      return;
    }

    const temp = options.find((opt) => opt[OPTION_KEY] === value);
    if (typeof temp === "undefined") {
      return;
    }
    setOptionActive(temp);
  }, [options, value, onUpdate]);

  const onSelect = (itm) => {
    if (!itm) {
      return;
    }

    onUpdate(itm[OPTION_KEY]);
  };

  if (!options) {
    return null;
  }

  return (
    <WrapperItem>
      <ItemLabel>{t("settings_preference_timezone")}</ItemLabel>
      <ItemDesc>
        <WrapperSelect>
          <Select
            activeItem={optionActive}
            items={options}
            indexKey={OPTION_KEY}
            indexText={OPTION_TEXT}
            onSelectEvent={onSelect}
            isReadonly={isReadOnly}
            isSkipTrans
          />
        </WrapperSelect>
      </ItemDesc>
    </WrapperItem>
  );
};

export default Timezone;
