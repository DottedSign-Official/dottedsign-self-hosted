import MoreActions from "../../../containers/MoreActions";

const MoreActionsTemplate = ({
  t,
  templateId,
  filterType,
  isGroupShare,
  handleTemplateAdminShare,
  handleDeleteTemplateAdminShare,
}) => {
  const actions = [
    {
      iconType: "trashcan",
      iconSize: "16px",
      name: t("template_more_cancel_share", { ns: "common" }),
      func: () => {
        handleDeleteTemplateAdminShare({ templateId, filterType });
      },
    },
  ];

  if (isGroupShare) {
    actions.unshift({
      iconType: "share",
      iconSize: "16px",
      name: t("template_more_share_other_group", { ns: "common" }),
      func: () => {
        handleTemplateAdminShare({ templateId, filterType });
      },
    });
  }

  return <MoreActions actions={actions} />;
};

export default MoreActionsTemplate;
