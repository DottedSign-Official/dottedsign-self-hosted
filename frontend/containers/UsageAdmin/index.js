import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { openModal as openModalAction } from "../../redux/actions/common";
import { getOrganization } from "../../redux/actions/admin";
import { MODAL_TYPE, USER_STATUS } from "../../constants/constants";
import UsageAdminComp from "../../components/UsageAdmin";

const UsageAdmin = ({ isDetail }) => {
  const user = useSelector((state) => state.auth.user);
  const org = useSelector((state) => state.admin.organization);

  const dispatch = useDispatch();
  const openModal = (data) => dispatch(openModalAction(data));

  useEffect(() => {
    if (!org) {
      dispatch(getOrganization());
    }
  }, [dispatch, org]);

  const onInviteUser = () => openModal({ modalType: MODAL_TYPE.userInvite });

  const isPlaceholder = !org || !user;

  const usage = (() => {
    if (isPlaceholder) {
      return 0;
    }
    const acceptedMembers = org.group_members.filter(
      (members) => members.status === USER_STATUS.accepted,
    );
    return acceptedMembers.length;
  })();

  return (
    <UsageAdminComp
      onInviteUser={onInviteUser}
      isDetail={isDetail}
      isPlaceholder={isPlaceholder}
      usage={usage}
    />
  );
};

export default UsageAdmin;
