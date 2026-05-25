import React from "react";
import { useTranslation } from "react-i18next";
import Select from "../../../../containers/Select";
import {
  WrapperItem,
  ItemLabel,
  ItemDesc,
  WrapperSelect,
} from "../../../../global/styledSettings";

const getOptions = (t) => {
  return [
    {
      text: t("settings_off"),
      value: false,
    },
    {
      text: t("settings_on"),
      value: true,
    },
  ];
};

const SettingPreferenceSigMain = ({ value, onUpdate, isReadOnly }) => {
  const { t } = useTranslation("settings");
  const options = getOptions(t);
  const optionActive = options.find((opt) => opt.value === value) || options[0];

  const onSelect = (itm) => {
    onUpdate(itm.value);
  };

  return (
    <WrapperItem>
      <ItemLabel>{t("settings_preference_timezone_display")}</ItemLabel>
      <ItemDesc>
        <WrapperSelect>
          <Select
            activeItem={optionActive}
            items={options}
            indexKey="value"
            indexText="text"
            onSelectEvent={onSelect}
            isReadonly={isReadOnly}
          />
        </WrapperSelect>
      </ItemDesc>
    </WrapperItem>
  );
};

export default SettingPreferenceSigMain;
