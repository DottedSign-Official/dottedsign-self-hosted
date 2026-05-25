import React from "react";
import { useSelector, useDispatch } from "react-redux";
import * as commonActions from "../../redux/actions/common";
import { MODAL_TYPE } from "../../constants/constants";
import Loader from "../../components/Loaders/SettingAccount";
import SettingAccount from "../../components/SettingAccount";

const SettingAccountContainer = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const openModal = (data) => dispatch(commonActions.openModal(data));

  const onEditInfoClick = () => {
    const payload = {
      modalType: MODAL_TYPE.accountEdit,
      modalData: null,
    };

    openModal(payload);
  };

  const onChangePasswordClick = () => {
    const payload = {
      modalType: MODAL_TYPE.accountChangePassword,
    };

    openModal(payload);
  };

  if (!user) {
    return <Loader />;
  }

  return (
    <SettingAccount
      user={user}
      onEditInfoClick={onEditInfoClick}
      onChangePasswordClick={onChangePasswordClick}
    />
  );
};

export default SettingAccountContainer;
