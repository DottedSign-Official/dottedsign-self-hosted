import React from "react";
import { useTranslation } from "next-i18next";

import { titles, colsStyle } from "./data";
import MoreActionsList from "../MoreActionsList";

const DeclineReasonList = ({
  declineReasons,
  handleAddDeclineReason,
  handleEditDeclineReason,
  handleRemoveDeclineReason,
}) => {
  const { t } = useTranslation(["admin", "common"]);

  return (
    <MoreActionsList
      title={t("decline_reason")}
      settings={{ titles, colsStyle, keys: ["content", "createdAt"] }}
      data={declineReasons}
      editable={declineReasons.map(({ readOnly }) => !readOnly)}
      handleAdd={handleAddDeclineReason}
      handleEdit={handleEditDeclineReason}
      handleRemove={handleRemoveDeclineReason}
      buttonAddText={t("create", { ns: "common" })}
      t={t}
    />
  );
};

export default DeclineReasonList;
