import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { orderBy } from "../../helpers/others";
import { MODAL_TYPE } from "../../constants/constants";
import { openModal as openModalAction } from "../../redux/actions/common";
import {
  getRolesList,
  setMemberRole as setMemberRoleAction,
  delGroupMember as delGroupMemberAction,
} from "../../redux/actions/admin";
import UserListComponent from "../../components/UserListAdmin";

const UserList = () => {
  const [orderKey, setOrderKey] = useState("name");
  const [isAsc, setIsAsc] = useState(true);
  const [list, setList] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const { group_id } = user;
  const { roleList } = useSelector((state) => state.admin);
  const org = useSelector((state) => state.admin.organization);

  const dispatch = useDispatch();
  const openModal = (data) => dispatch(openModalAction(data));
  const setMemberRole = (data) => dispatch(setMemberRoleAction(data));
  const delGroupMember = (data) => dispatch(delGroupMemberAction(data));

  useEffect(() => {
    if (!group_id) {
      return;
    }

    dispatch(getRolesList({ group_id }));
  }, [group_id, dispatch]);

  useEffect(() => {
    if (org) {
      if (orderKey) {
        const dir = isAsc ? "asc" : "desc";
        const newList = orderBy({
          list: org.group_members,
          key: orderKey,
          direction: dir,
        });
        setList(newList);
      } else {
        setList(org.group_members);
      }
    }
  }, [orderKey, isAsc, org]);

  const onSetRole = (itm) => {
    const params = {
      email: itm.email,
      roles: [itm.role],
    };
    setMemberRole(params);
  };

  const onDelMember = (email) => {
    openModal({
      modalType: MODAL_TYPE.groupMemberDeleteConfirm,
      modalData: { onConfirm: () => delGroupMember({ email }) },
    });
  };

  const onOrderChange = (key) => {
    setOrderKey(key);
  };

  const onDirectionChange = () => {
    setIsAsc(!isAsc);
  };

  const permission = user.current_permission;

  const isPlaceholder = !list;
  const isBtnHide = !list || (permission && !permission.manage_users);

  return (
    <UserListComponent
      isPlaceholder={isPlaceholder}
      isBtnHide={isBtnHide}
      orderKey={orderKey}
      isAsc={isAsc}
      usersAdmin={list}
      roles={roleList || []}
      onSetRole={onSetRole}
      onDelMember={onDelMember}
      onOrderChange={onOrderChange}
      onDirectionChange={onDirectionChange}
    />
  );
};

export default UserList;
