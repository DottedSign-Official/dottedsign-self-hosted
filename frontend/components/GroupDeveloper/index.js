import { useTranslation } from "react-i18next";

import LoaderLabel from "../Loaders/Label";
import Loader from "../Loaders/AdminUserList";
import Pagination from "../Pagination";

import { Block, BlockContent } from "../../global/styledAdmin";
import { PaginationWrapper } from "./styled";
import { titles, colsStyle } from "./data";
import MoreActionsList from "../MoreActionsList";
import TooltipExtend from "../TooltipExtend";

const GroupDeveloper = ({
  groups,
  totalPages,
  currentPage,
  onPageChange,
  isPlaceholder,
  onCreateGroup,
  onEditGroupName,
  onEditGroupMembers,
}) => {
  const { t } = useTranslation("developer");

  if (isPlaceholder) {
    return (
      <Block width="100%">
        <LoaderLabel />
        <BlockContent>
          <Loader />
        </BlockContent>
      </Block>
    );
  }

  const data = groups.map(({ name, members, group_id }) => ({
    group_id,
    name,
    displayname: <TooltipExtend text={name} />,
    memberNumbers: <TooltipExtend text={members.length} />,
  }));
  const editable = groups.map(() => true);
  const getActions = (data) => [
    {
      iconType: "editUnderline",
      iconSize: "16px",
      name: t("edit_group_name"),
      func: () => {
        onEditGroupName(data);
      },
    },
    {
      iconType: "editUnderline",
      iconSize: "16px",
      name: t("edit_group_members"),
      func: () => {
        onEditGroupMembers(data);
      },
    },
  ];

  return (
    <>
      <MoreActionsList
        title={t("label_group_list")}
        settings={{ titles, colsStyle, keys: ["displayname", "memberNumbers"] }}
        data={data}
        editable={editable}
        getActions={getActions}
        handleAdd={onCreateGroup}
        buttonAddText={t("create", { ns: "common" })}
        t={t}
      />
      <PaginationWrapper>
        <Pagination
          page={currentPage}
          pages={totalPages}
          onTabClick={onPageChange}
        />
      </PaginationWrapper>
    </>
  );
};

export default GroupDeveloper;
