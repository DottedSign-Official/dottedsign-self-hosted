import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";
import {
  getPermissions,
  putPermissions as putPermissionsAction,
  getRolesList,
  changeRolePriority as changeRolePriorityAction,
  deleteRole as deleteRoleAction,
} from "../../redux/actions/admin";
import { openModal as openModalAction } from "../../redux/actions/common";
import PermissionAdminComp from "../../components/PermissionAdmin";
import Loader from "../../components/Loaders/AdminPermissions";
import { MODAL_TYPE } from "../../constants/constants";
import { Block, Label } from "../../global/styledAdmin";

import data, { roleDefault, roleCustom } from "./data";

const PermissionAdmin = ({ focus }) => {
  const refTimer = useRef(null);
  const [isInit, setIsInit] = useState(true);
  const [isEdit, setIsEdit] = useState(false);

  const [backup, setBackup] = useState(null);
  const [roles, setRoles] = useState([]);
  const [permissionsLocal, setPermissionsLocal] = useState(null);
  const [hiddenKeyList, setHiddenKeyList] = useState([]);

  const { isLoading, permissions, roleList } = useSelector(
    (state) => state.admin,
  );
  const { user } = useSelector((state) => state.auth);
  const groupId = user.group_id;
  const dispatch = useDispatch();
  const putPermissions = (data) => dispatch(putPermissionsAction(data));
  const changeRolePriority = (data) => dispatch(changeRolePriorityAction(data));
  const deleteRole = (data) => dispatch(deleteRoleAction(data));
  const openModal = (data) => dispatch(openModalAction(data));
  const { t } = useTranslation("admin");

  useEffect(() => {
    dispatch(getPermissions());
  }, [dispatch]);

  useEffect(() => {
    if (!groupId) {
      return;
    }
    dispatch(getRolesList({ group_id: groupId }));
  }, [dispatch, groupId]);

  useEffect(() => {
    if (!permissions) {
      return;
    }
    if (isInit) {
      setIsInit(false);
      clearTimeout(refTimer.current);
    }
    setIsEdit(false);
    setRoles(permissions.map((role) => role.name));

    const focusItem = permissions.find((data) => data.name === focus);
    if (typeof focusItem === "undefined") {
      return;
    }
    const perms = focusItem.permission;
    setBackup(perms);
    setPermissionsLocal(perms);
  }, [focus, permissions, isInit]);

  useEffect(() => {
    if (!permissionsLocal) {
      return;
    }
    const temp = data.reduce((acc, section) => {
      const tempRows = section.rows.reduce((accR, row) => {
        if (!row.links) {
          return accR;
        }
        const key = row.key;
        if (permissionsLocal[key]) {
          return accR;
        }
        return [...accR, ...row.links];
      }, []);
      return [...acc, ...tempRows];
    }, []);

    setHiddenKeyList(temp);
  }, [permissionsLocal]);

  useEffect(() => {
    refTimer.current = setTimeout(() => {
      setIsInit(false);
    }, 5000);

    return () => clearTimeout(refTimer.current);
  }, []);

  const onEdit = () => {
    if (isLoading) {
      return;
    }
    setIsEdit(true);
  };

  const onUpdate = ({ key, value }) => {
    if (isLoading) {
      return;
    }
    const copy = JSON.parse(JSON.stringify(permissionsLocal));
    if (Array.isArray(key)) {
      key.map((k) => (copy[k] = value));
    } else {
      copy[key] = value;
    }
    setPermissionsLocal(copy);
  };

  const onInterLock = ({ value, links, hint }) => {
    if (isLoading) {
      return;
    }
    if (value) {
      return;
    }
    openModal({
      modalType: MODAL_TYPE.interLocking,
      modalData: {
        onUpdate: () =>
          onUpdate({
            key: links,
            value,
          }),
        hint,
      },
    });
  };

  const onMoveUp = (role_id) => {
    let idList = [...roleList]
      .sort((a, b) => a.priority - b.priority)
      .map((el) => el.role_id);
    const currentIndex = idList.findIndex((el) => el === role_id);
    if (currentIndex - 1 === 0) {
      return;
    }
    let tmp;
    tmp = idList[currentIndex - 1];
    idList[currentIndex - 1] = role_id;
    idList[currentIndex] = tmp;

    changeRolePriority({ role_ids: idList, group_id: groupId });
  };

  const onMoveDown = (role_id) => {
    let idList = [...roleList]
      .sort((a, b) => a.priority - b.priority)
      .map((el) => el.role_id);
    const currentIndex = idList.findIndex((el) => el === role_id);
    if (currentIndex === idList.length - 1) {
      return;
    }
    let tmp;
    tmp = idList[currentIndex + 1];
    idList[currentIndex + 1] = role_id;
    idList[currentIndex] = tmp;

    changeRolePriority({ role_ids: idList, group_id: groupId });
  };

  const onMoveToTop = (role_id) => {
    let idList = [...roleList]
      .sort((a, b) => a.priority - b.priority)
      .map((el) => el.role_id);
    const currentIndex = idList.findIndex((el) => el === role_id);
    if (currentIndex === 1) {
      return;
    }
    const newIdList = idList.filter((el, i) => i !== currentIndex);
    newIdList.splice(1, 0, role_id);

    changeRolePriority({ role_ids: newIdList, group_id: groupId });
  };

  const onDeleteRole = (role_id) => {
    deleteRole({ group_id: groupId, role_id });
  };

  const onCreateRole = () => {
    openModal({
      modalType: MODAL_TYPE.roleModal,
      modalData: { groupId, roleList, roleDefault },
    });
  };

  const onConfirm = () => {
    if (isLoading) {
      return;
    }

    const newPermissions = permissions.map((permission) => {
      if (permission.name !== focus) {
        return permission;
      }
      return { role: focus, ...permissionsLocal };
    });
    putPermissions(newPermissions);
  };

  const onCancel = () => {
    if (isLoading) {
      return;
    }

    setIsEdit(false);
    setPermissionsLocal({ ...backup });
  };

  if (isInit) {
    return (
      <Block width="100%">
        <Label>{t("label_permissions")}</Label>
        <Loader />
      </Block>
    );
  }

  return (
    <PermissionAdminComp
      focus={focus}
      isLoading={isLoading}
      isEdit={isEdit}
      hiddenKeyList={hiddenKeyList}
      roles={roles}
      permissions={permissionsLocal}
      onEdit={onEdit}
      onUpdate={onUpdate}
      onInterLock={onInterLock}
      onConfirm={onConfirm}
      onCancel={onCancel}
      onCreateRole={onCreateRole}
      onDeleteRole={onDeleteRole}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onMoveToTop={onMoveToTop}
      data={data}
      roleList={roleList}
      roleDefault={roleDefault}
      roleCustom={roleCustom}
    />
  );
};

export default PermissionAdmin;
