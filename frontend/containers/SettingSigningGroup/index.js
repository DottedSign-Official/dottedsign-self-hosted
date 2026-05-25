import React, { useEffect, useCallback } from "react";
import uuid from "uuid/v1";
import { useSelector, useDispatch } from "react-redux";
import { openModal as openModalAction } from "../../redux/actions/common";
import {
  getSigningGroup as getSigningGroupAction,
  setSigningGroupCurrentPage as setCurrentPageAction,
} from "../../redux/actions/settings";
import { setSigningGroupParams as setSigningGroupParamsAction } from "../../redux/actions/modalCache";
import { useSigningGroups } from "../../helpers/customHooks";
import { ASSIGNE_DEFAULTS } from "../../constants/assigne";
import { MODAL_TYPE, STAGE_TYPES } from "../../constants/constants";
import Comp from "../../components/SettingSigningGroup";

const SigningGroup = ({ isIniLoading }) => {
  const { isCreatable } = useSigningGroups();
  const {
    isLoading,
    signingGroup,
    signingGroupCurrentPage,
    signingGroupTotalPages,
  } = useSelector((state) => state.settings);
  const dispatch = useDispatch();
  const openModal = (data) => dispatch(openModalAction(data));
  const getSigningGroup = useCallback(
    (data) => dispatch(getSigningGroupAction(data)),
    [dispatch],
  );
  const setCurrentPage = (data) => dispatch(setCurrentPageAction(data));
  const setSigningGroupParams = (data) =>
    dispatch(setSigningGroupParamsAction(data));

  useEffect(() => {
    const payload = { page: signingGroupCurrentPage };
    getSigningGroup(payload);
  }, [signingGroupCurrentPage, getSigningGroup]);

  const onPageChanged = (pg) => {
    setCurrentPage(pg);
  };

  const onCreate = () => {
    if (!isCreatable) {
      return;
    }

    setSigningGroupParams({
      isSigningGroupCreate: true,
      signingGroupSigners: [
        {
          key: 0,
          uid: uuid(),
          stage_type: STAGE_TYPES.sign,
          name: "",
          email: "",
          others: ASSIGNE_DEFAULTS[STAGE_TYPES.sign],
        },
      ],
    });

    openModal({ modalType: MODAL_TYPE.signingGroup });
  };

  return (
    <Comp
      isLoading={isIniLoading || isLoading}
      groups={signingGroup}
      pageCurrent={signingGroupCurrentPage}
      pages={signingGroupTotalPages}
      onPageChanged={onPageChanged}
      onCreate={onCreate}
    />
  );
};

export default SigningGroup;
