import { titles, colsStyle } from "./data";
import MoreActionsList from "../MoreActionsList";
import { useTranslation } from "react-i18next";
import TooltipExtend from "../TooltipExtend";
import Icon from "../Icon";
import { IconWrapper, GroupNameWrapper } from "./styled";
import RoleSelect from "./RoleSelect";

const GroupDeveloperMembers = ({
  groupName,
  members,
  roleList,
  onInviteMember,
  onRemoveMemberFromGroup,
  onChangeMemberRole,
  onPrevious,
  mapDataToEditable,
}) => {
  const { t } = useTranslation("developer");

  const data = members.map(({ email, group_permission, name }) => ({
    email,
    displayName: <TooltipExtend text={name} />,
    displayEmail: <TooltipExtend text={email} />,
    role: (
      <RoleSelect
        roleList={roleList}
        onSelectEvent={(role) => {
          onChangeMemberRole({ role, email });
        }}
        activeRole={group_permission[0].name}
      />
    ),
  }));
  const editable = members.map(mapDataToEditable);
  const getActions = (data) => [
    {
      iconType: "trashcan",
      iconSize: "16px",
      name: t("remove_group_member"),
      func: () => {
        onRemoveMemberFromGroup(data);
      },
    },
  ];

  const title = (
    <>
      <IconWrapper onClick={onPrevious}>
        <Icon type="previous" />
      </IconWrapper>
      {t("label_group_member_list")}
      <GroupNameWrapper>
        <TooltipExtend text={groupName} />
      </GroupNameWrapper>
    </>
  );

  return (
    <MoreActionsList
      title={title}
      settings={{
        titles,
        colsStyle,
        keys: ["displayName", "displayEmail", "role", "remove"],
      }}
      data={data}
      editable={editable}
      handleAdd={onInviteMember}
      buttonAddText={t("invite")}
      getActions={getActions}
      t={t}
    />
  );
};

export default GroupDeveloperMembers;
