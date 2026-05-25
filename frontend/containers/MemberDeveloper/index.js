import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";

import MemberDeveloperComp from "../../components/MemberDeveloper";
import {
  getAllMembers,
  modifyMemberStatus,
} from "../../redux/actions/developer";
import { statusMenus, groupMenus, searchTypes } from "./data";
import { openModal } from "../../redux/actions/common";
import { MODAL_TYPE } from "../../constants/constants";

const DEFAULT_STATUS_MENU_ITEM = statusMenus[0];
const DEFAULT_GROUP_MENU_ITEM = groupMenus[0];

const MemberDeveloper = () => {
  const { t } = useTranslation("modal");
  const dispatch = useDispatch();
  const { members, isLoading, currentPage, totalPages } = useSelector(
    (state) => state.developer,
  );

  const [selectStatusMenuItem, setSelectStatusMenuItem] = useState(
    DEFAULT_STATUS_MENU_ITEM || null,
  );
  const [selectGroupMenuItem, setSelectGroupMenuItem] = useState(
    DEFAULT_GROUP_MENU_ITEM || null,
  );

  const [selectedSearchItem, setSelectedSearchItem] = useState(searchTypes[0]);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    dispatch(getAllMembers());
  }, [dispatch]);

  const getCommonPayload = () => ({
    filterStatus: selectStatusMenuItem.value,
    filterNoneGroup: selectGroupMenuItem.value,
    [selectedSearchItem.value]: keyword,
  });

  const onModifyMemberStatus = (member) => {
    const isActive = member.status === "active";
    const { email } = member;
    const status = isActive ? "inactive" : "active";

    if (!isActive) {
      dispatch(
        modifyMemberStatus({
          ...getCommonPayload(),
          email,
          status,
        }),
      );
      return;
    }

    dispatch(
      openModal({
        modalType: MODAL_TYPE.confirm,
        modalData: {
          title: "modal_delete_title",
          content: "modal_member_freeze_confirm_content",
          confirmType: "warn",
          confirmButtonName: t("btn_freeze"),
          handleConfirm: () => {
            dispatch(
              modifyMemberStatus({
                ...getCommonPayload(),
                email,
                status,
              }),
            );
          },
        },
      }),
    );
  };

  const onPageChange = (page) => {
    dispatch(
      getAllMembers({
        ...getCommonPayload(),
        page,
      }),
    );
  };

  const handleStatusMenuItemClick = (menuItem) => {
    setSelectStatusMenuItem(menuItem);
    dispatch(
      getAllMembers({
        ...getCommonPayload(),
        filterStatus: menuItem.value,
      }),
    );
  };

  const handleGroupMenuItemClick = (menuItem) => {
    setSelectGroupMenuItem(menuItem);
    dispatch(
      getAllMembers({
        ...getCommonPayload(),
        filterNoneGroup: menuItem.value,
      }),
    );
  };

  const handleSelect = (item) => {
    setSelectedSearchItem(item);
  };

  const handleSearch = (value) => {
    setKeyword(value);
    dispatch(
      getAllMembers({
        ...getCommonPayload(),
        [selectedSearchItem.value]: value,
      }),
    );
  };

  return (
    <MemberDeveloperComp
      members={members}
      onSearch={handleSearch}
      totalPages={totalPages}
      currentPage={currentPage}
      isPlaceholder={isLoading}
      statusMenus={statusMenus}
      groupMenus={groupMenus}
      searchTypes={searchTypes}
      onPageChange={onPageChange}
      selectedSearchItem={selectedSearchItem}
      handleSelect={handleSelect}
      defaultStatusMenuItem={DEFAULT_STATUS_MENU_ITEM}
      defaultGroupMenuItem={DEFAULT_GROUP_MENU_ITEM}
      onStatusMenuItemClick={handleStatusMenuItemClick}
      onGroupMenuItemClick={handleGroupMenuItemClick}
      onModifyMemberStatus={onModifyMemberStatus}
    />
  );
};

export default MemberDeveloper;
