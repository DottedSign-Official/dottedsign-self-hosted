import React from "react";
import { useSelector, useDispatch } from "react-redux";

import SignerPermissionsCreate from "./Create";
import SignerPermissionsUpdate from "./Update";

import { openModal as openModalAction } from "../../../../redux/actions/common";
import { setAssignes as setAssignesAction } from "../../../../redux/actions/create";
import { MODAL_TYPE } from "../../../../constants/constants";

const SignerPermissions = ({ data: { isInfoUpdate = false } }) => {
  const { stagesUpdate, stage_infos } = useSelector((state) => state.sign);
  const { isTemplate, assignes, stages } = useSelector((state) => state.create);

  const dispatch = useDispatch();
  const openModal = (data) => dispatch(openModalAction(data));
  const setAssignes = (data) => dispatch(setAssignesAction(data));

  const onPrev = () => {
    let modalType;

    if (isTemplate) {
      modalType = MODAL_TYPE.createConfirmTemplate;
    } else if (isInfoUpdate) {
      modalType = MODAL_TYPE.taskInfoUpdate;
    } else {
      modalType = MODAL_TYPE.createConfirm;
    }

    openModal({ modalType });
  };

  const onPermissionToggle = (idx, key) => {
    const dulAssignes = Object.assign([], assignes);
    const newAssigne = {
      ...assignes[idx],
      stage_setting: {
        ...assignes[idx].stage_setting,
        [key]: !assignes[idx].stage_setting[key],
      },
    };

    dulAssignes[idx] = newAssigne;
    setAssignes({
      assignes: dulAssignes,
      stages,
    });
  };

  return isInfoUpdate ? (
    <SignerPermissionsUpdate
      onPrev={onPrev}
      stageInfos={stage_infos}
      stagesUpdate={stagesUpdate}
    />
  ) : (
    <SignerPermissionsCreate
      onPrev={onPrev}
      assignes={assignes}
      isTemplate={isTemplate}
      onPermissionToggle={onPermissionToggle}
    />
  );
};

export default SignerPermissions;
