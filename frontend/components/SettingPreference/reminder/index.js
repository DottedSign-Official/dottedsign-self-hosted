import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import Tooltip from "../../../containers/Tooltip";
import Select from "../../../containers/Select";
import tooltip from "../../../constants/tooltip";
import { reminderOptions, expireOptions } from "./data";
import {
  WrapperItem,
  ItemLabel,
  ItemDesc,
  WrapperSelect,
} from "../../../global/styledSettings";

const Reminder = ({ isEdit, preference, onUpdate }) => {
  const { t } = useTranslation("settings");

  const [myReminder, setMyReminder] = useState(null);

  useEffect(() => {
    if (preference) {
      const notify = reminderOptions.find(
        (opt) => opt.value === preference.forget_remind,
      );

      let expire;
      if (!preference.expire_remind) {
        expire = expireOptions[0];
      } else {
        const ex = expireOptions.find(
          (opt) => opt.value === preference.remind_days_before_expire,
        );

        expire = ex !== undefined ? ex : expireOptions[0];
      }

      setMyReminder({ notify, expire });
    } else {
      setMyReminder({
        notify: reminderOptions[0],
        expire: expireOptions[0],
      });
    }
  }, [preference]);

  const onReminderSelect = (key) => (item) => {
    if (key === "expire") {
      onUpdate({
        expire_remind: item.value !== 0,
        remind_days_before_expire: item.value,
      });

      return;
    }

    onUpdate({ [key]: item.value });
  };

  if (!myReminder) {
    return null;
  }

  return (
    <>
      <WrapperItem data-testid="auto_remind_block">
        <ItemLabel>
          {t("settings_preference_reminder")}&nbsp;
          <Tooltip type={tooltip.autoReminder} />
        </ItemLabel>
        <ItemDesc>
          <WrapperSelect>
            <Select
              activeItem={myReminder.notify}
              items={reminderOptions}
              indexKey="value"
              indexText="text"
              onSelectEvent={onReminderSelect("forget_remind")}
              isReadonly={!isEdit}
            />
          </WrapperSelect>
        </ItemDesc>
      </WrapperItem>
      <WrapperItem data-testid="remind_expires_block">
        <ItemLabel>
          {t("settings_preference_expire")}&nbsp;
          <Tooltip type={tooltip.dateExpiration} />
        </ItemLabel>
        <ItemDesc>
          <WrapperSelect>
            <Select
              activeItem={myReminder.expire}
              items={expireOptions}
              indexKey="value"
              indexText="text"
              onSelectEvent={onReminderSelect("expire")}
              isReadonly={!isEdit}
            />
          </WrapperSelect>
        </ItemDesc>
      </WrapperItem>
    </>
  );
};

export default Reminder;
