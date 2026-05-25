import React from "react";
import { useTranslation } from "next-i18next";
import { titles, colsStyle } from "./data";
import MoreActionsList from "../MoreActionsList";

const LabelList = ({
  labels,
  handleAddLabel,
  handleEditLabel,
  handleRemoveLabel,
  handleKeywordSearch,
  searchValue,
}) => {
  const { t } = useTranslation(["settings", "common"]);

  return (
    <MoreActionsList
      settings={{ titles, colsStyle }}
      data={labels}
      editable={labels.map(() => true)}
      handleAdd={handleAddLabel}
      handleEdit={handleEditLabel}
      handleRemove={handleRemoveLabel}
      handleKeywordSearch={handleKeywordSearch}
      searchValue={searchValue}
      buttonAddText={t("btn_add_label")}
      t={t}
    />
  );
};

export default LabelList;
