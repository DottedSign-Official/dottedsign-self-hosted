import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import Btn from "../Button";
import BlockReminder from "./reminder";
import BlockLang from "./lang";
import BlockDate from "../DateFormatDropdowns";
import BlockSignature from "./signature";
import { Divider, DividerBtn } from "../../global/styled";
import { ContentBlock, Label, ItemLabel } from "../../global/styledSettings";
import { Panel } from "./styled";

const SettingPreference = ({ initialValue, onSubmit }) => {
  const { t } = useTranslation("settings");
  const [isEdit, setIsEdit] = useState(false);
  const [preference, setPreference] = useState(null);

  useEffect(() => {
    setPreference(initialValue);
  }, [initialValue]);

  const onEdit = () => {
    setIsEdit(true);
  };

  const onCancel = () => {
    setIsEdit(false);
    setPreference(initialValue);
  };

  const onUpdate = (data) => {
    const newPreference = { ...preference, ...data };
    setPreference(newPreference);
  };

  const onSend = () => {
    setIsEdit(false);
    onSubmit(preference);
  };

  return (
    <>
      <ContentBlock>
        <Label>{t("label_preference_sign")}</Label>
        <BlockDate
          isEdit={isEdit}
          date_format={preference?.date_format}
          onUpdate={onUpdate}
          label={<ItemLabel>{t("settings_preference_date")}</ItemLabel>}
        />
        <BlockSignature
          isEdit={isEdit}
          preference={preference}
          onUpdate={onUpdate}
        />
      </ContentBlock>
      <Divider />
      <ContentBlock>
        <Label>{t("label_preference_task")}</Label>
        <BlockReminder
          isEdit={isEdit}
          preference={preference}
          onUpdate={onUpdate}
        />
        <BlockLang
          isEdit={isEdit}
          preference={preference}
          onUpdate={onUpdate}
        />
      </ContentBlock>

      <Panel>
        {isEdit ? (
          <>
            <Btn type="cancel" handleEvent={onCancel}>
              {t("cancel")}
            </Btn>
            <DividerBtn />
            <Btn type="primaryFlex" handleEvent={onSend}>
              {t("save")}
            </Btn>
          </>
        ) : (
          <Btn type="settingEdit" handleEvent={onEdit}>
            {t("edit")}
          </Btn>
        )}
      </Panel>
    </>
  );
};

export default SettingPreference;
