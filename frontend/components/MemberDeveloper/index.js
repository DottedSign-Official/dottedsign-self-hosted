import React from "react";
import { useTranslation } from "react-i18next";

import ColumnWithMenu from "../ColumnWithMenu";
import Pagination from "../Pagination";
import ListItemLoader from "../Loaders/ListItem";
import ListContent from "./ListContent";
import Search from "./Search";

import {
  Block,
  Label,
  BlockContent,
  WrapperList,
  ListTitle,
  Col,
} from "../../global/styledAdmin";
import { PaginationWrapper } from "./styled";

const MemberDeveloper = ({
  members,
  onSearch,
  totalPages,
  currentPage,
  statusMenus,
  groupMenus,
  searchTypes,
  onPageChange,
  selectedSearchItem,
  handleSelect,
  isPlaceholder,
  defaultStatusMenuItem,
  defaultGroupMenuItem,
  onStatusMenuItemClick,
  onGroupMenuItemClick,
  onModifyMemberStatus,
}) => {
  const { t } = useTranslation("developer");

  return (
    <Block width="100%">
      <Label>{t("label_member_list")}</Label>
      <Search
        onSearch={onSearch}
        searchTypes={searchTypes}
        handleSelect={handleSelect}
        selectedSearchItem={selectedSearchItem}
      />
      <BlockContent>
        <WrapperList>
          <ListTitle>
            <Col len="40%" isTitle>
              {t("email")}
            </Col>
            <ColumnWithMenu
              t={t}
              len="40%"
              isTitle
              hideSelectedResult
              menus={groupMenus}
              defaultMenuItem={defaultGroupMenuItem}
              onMenuItemClick={onGroupMenuItemClick}
            >
              {t("belonging_group")}
            </ColumnWithMenu>
            <ColumnWithMenu
              t={t}
              len="10%"
              isTitle
              menus={statusMenus}
              hideSelectedResult
              defaultMenuItem={defaultStatusMenuItem}
              onMenuItemClick={onStatusMenuItemClick}
            >
              {t("status")}
            </ColumnWithMenu>
            <Col len="10%" isTitle></Col>
          </ListTitle>

          {isPlaceholder ? (
            <ListItemLoader count={Math.max(members.length, 3)} />
          ) : (
            <ListContent
              members={members}
              onModifyMemberStatus={onModifyMemberStatus}
            />
          )}
        </WrapperList>
      </BlockContent>

      <PaginationWrapper>
        <Pagination
          page={currentPage}
          pages={totalPages}
          onTabClick={onPageChange}
        />
      </PaginationWrapper>
    </Block>
  );
};

export default MemberDeveloper;
