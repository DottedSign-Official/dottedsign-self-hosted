import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import GroupDeveloperComp from "../../components/GroupDeveloper";
import GroupDeveloperMembers from "../../components/GroupDeveloperMembers";
import {
  getAllGroups,
  updateGroup,
  createGroup,
  putMemberRole,
  removeMemberFromGroup,
  assignGroupMember,
} from "../../redux/actions/developer";
import { getRolesList, clearRoleList } from "../../redux/actions/admin";
import { closeModal, openModal } from "../../redux/actions/common";
import { MODAL_TYPE } from "../../constants/constants";

const GroupDeveloper = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isLoading, groups, currentPage, totalPages } = useSelector(
    (state) => state.developer,
  );
  const { roleList } = useSelector((state) => state.admin);
  const [focusingGroupId, setFocusingGroupId] = useState(null);
  const focusingGroup = groups.find(
    ({ group_id }) => group_id === focusingGroupId,
  );

  useEffect(() => {
    dispatch(getAllGroups());
  }, [dispatch]);

  const onPageChange = (page) => {
    dispatch(getAllGroups({ page }));
  };

  const onEditGroupName = ({ name, group_id }) => {
    const title = { text: "edit_group_name", namespace: "developer" };

    const onSubmit = (text) => {
      dispatch(updateGroup({ groupId: group_id, groupName: text }));
    };

    dispatch(
      openModal({
        modalType: MODAL_TYPE.textInput,
        modalData: {
          text: name,
          title,
          isLoading: false,
          onSubmit,
        },
      }),
    );
  };

  const onCreateGroup = () => {
    const title = { text: "create_group", namespace: "developer" };

    const onSubmit = (text) => {
      dispatch(createGroup({ text }));
    };

    dispatch(
      openModal({
        modalType: MODAL_TYPE.textInput,
        modalData: {
          text: "",
          title,
          isLoading: false,
          onSubmit,
        },
      }),
    );
  };

  const onEditGroupMembers = ({ group_id }) => {
    setFocusingGroupId(group_id);
    dispatch(getRolesList({ group_id }));
  };

  const onLeaveEditGroupMembers = () => {
    setFocusingGroupId(null);
    dispatch(clearRoleList());
  };

  const onInviteMember = () => {
    const title = { text: "invite_member", namespace: "developer" };

    const onSubmit = (text) => {
      dispatch(assignGroupMember({ email: text, groupId: focusingGroupId }));
    };

    dispatch(
      openModal({
        modalType: MODAL_TYPE.textInput,
        modalData: {
          text: "",
          title,
          isLoading: false,
          onSubmit,
        },
      }),
    );
  };

  const onRemoveMemberFromGroup = ({ email }) => {
    const handleConfirm = () => {
      dispatch(removeMemberFromGroup({ groupId: focusingGroupId, email }));
    };

    const handleReject = () => {
      dispatch(closeModal());
    };

    dispatch(
      openModal({
        modalType: MODAL_TYPE.confirm,
        modalData: {
          title: "modal_delete_title",
          content: "modal_delete_group_member",
          confirmType: "warn",
          handleConfirm,
          handleReject,
        },
      }),
    );
  };

  const onChangeMemberRole = ({ role, email }) => {
    dispatch(putMemberRole({ role, email }));
  };

  const mapMemberToEditable = (member) => {
    return member.email !== user.email;
  };

  return (
    <>
      {!focusingGroup && (
        <GroupDeveloperComp
          groups={groups}
          totalPages={totalPages}
          currentPage={currentPage}
          isPlaceholder={isLoading}
          onPageChange={onPageChange}
          onCreateGroup={onCreateGroup}
          onEditGroupName={onEditGroupName}
          onEditGroupMembers={onEditGroupMembers}
        />
      )}
      {focusingGroup && (
        <GroupDeveloperMembers
          groupId={focusingGroup.group_id}
          groupName={focusingGroup.name}
          members={focusingGroup.members}
          roleList={roleList}
          onPrevious={onLeaveEditGroupMembers}
          mapDataToEditable={mapMemberToEditable}
          onInviteMember={onInviteMember}
          onRemoveMemberFromGroup={onRemoveMemberFromGroup}
          onChangeMemberRole={onChangeMemberRole}
        />
      )}
    </>
  );
};

export default GroupDeveloper;
