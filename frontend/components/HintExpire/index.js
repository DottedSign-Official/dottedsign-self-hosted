import React from "react";
import { useTranslation } from "next-i18next";
import { Wrapper } from "./styled";

const HintExpire = ({ days }) => {
  const { t } = useTranslation("tasks");

  const isExpired = days <= 0;
  const isExpiredToday = days === 1;
  const status = (() => {
    if (isExpiredToday) {
      return "warning";
    }
    if (isExpired) {
      return "expired";
    }

    return "normal";
  })();

  return (
    <Wrapper status={status}>
      {isExpired
        ? t("hint_expired")
        : isExpiredToday
        ? t("hint_expire_today")
        : `${t("hint_expire")} ${days} ${t("days")}`}
    </Wrapper>
  );
};

export default HintExpire;
