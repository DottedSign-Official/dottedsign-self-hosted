import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { isEmail } from "../../helpers/utility";
import SystemCAMemberFormComp from "../../components/SystemCAMemberForm";

import { updateSystemCAMembers as updateSystemCAMembersAction } from "../../redux/actions/admin";
import { openToast as openToastAction } from "../../redux/actions/common";

import { ACCEPT_STATUS } from "../../constants/constants";
import toastStatus from "../../constants/toast";

const SystemCAMemberForm = React.forwardRef(
  ({ id, members, setIsFormValid }, formRef) => {
    const dispatch = useDispatch();
    const updateSystemCAMembers = (data) =>
      dispatch(updateSystemCAMembersAction(data));
    const openToast = (data) => dispatch(openToastAction(data));

    const org = useSelector((state) => state.admin.organization);
    const acceptedMembers = org.group_members.filter(
      ({ name, status }) => name && status === ACCEPT_STATUS.accepted,
    );

    const [emailList, setEmailList] = useState(members || []);
    const [email, setMail] = useState("");

    const handleChangeMemberMail = (e) => setMail(e.target.value);
    const isInputValid = email && isEmail(email) && email.length > 0;

    const isEmailInAcceptedMembers = (email) => {
      return acceptedMembers.some((member) => member.email === email);
    };

    const handleAddMail = () => {
      if (isEmailInAcceptedMembers(email)) {
        const newEmailList = [...emailList, email];
        setEmailList([...new Set(newEmailList)]); // NOTE: remove duplicate email
        setMail("");
      } else {
        openToast({ payload: toastStatus.caMemberFal });
      }
    };

    const handleRemoveMail = (value) => {
      const result = [...emailList].filter((member) => member !== value);
      setEmailList([...result]);
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      updateSystemCAMembers({
        id,
        members: emailList,
      });
    };

    useEffect(() => {
      if (emailList.length > 0) {
        setIsFormValid(true);
      }
    }, [emailList, setIsFormValid]);

    return (
      <SystemCAMemberFormComp
        ref={formRef}
        email={email}
        emailList={emailList}
        isInputValid={isInputValid}
        handleRemoveMail={handleRemoveMail}
        handleSubmit={handleSubmit}
        handleChangeMemberMail={handleChangeMemberMail}
        handleAddMail={handleAddMail}
      />
    );
  },
);
SystemCAMemberForm.displayName = "SystemCAMemberForm";

export default SystemCAMemberForm;
