import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { openModal as openModalAction } from "../../../../redux/actions/common";
import { postSetup as postSetupAction } from "../../../../redux/actions/sign";
import { dateAddDays, getUnix } from "../../../../helpers/time";
import { MODAL_TYPE } from "../../../../constants/constants";
import InfoComponent from "../CreateConfirm/component";

const TaskInfoUpdate = ({ onModalClose, data }) => {
  const {
    task_id,
    envelope_id,
    isLoading,
    isOrder,
    involved,
    ccInfos,
    setup,
    reference_setting,
    completed_reference_setting,
    stagesUpdate,
    msgRequestReceivers,
    msgCompletedReceivers,
  } = useSelector((state) => state.sign);

  const dispatch = useDispatch();
  const openModal = (data) => dispatch(openModalAction(data));
  const postSetup = (data) => dispatch(postSetupAction(data));

  const [mySetup, setMySetup] = useState(null);

  useEffect(() => {
    setMySetup({ ...setup });
  }, [setup]);

  const isPermissionsButton = stagesUpdate && stagesUpdate.length > 0;
  const isInfoUpdate = true;

  const onSignerPermissions = () => {
    openModal({
      modalType: MODAL_TYPE.signerPermissions,
      modalData: {
        isInfoUpdate,
      },
    });
  };

  const onAuthIdentity = () => {
    openModal({
      modalType: MODAL_TYPE.authIdentity,
      modalData: {
        isInfoUpdate,
      },
    });
  };

  const onSettingChange = useCallback((data) => {
    setMySetup((prevSetup) => ({ ...prevSetup, ...data }));
  }, []);

  const onModify = () => {
    let setupPara = {
      ...(envelope_id
        ? { envelope_id: envelope_id }
        : { sign_task_id: task_id }),
      forget_remind: mySetup.forget_remind,
      need_otp_verify: mySetup.need_otp_verify,
      receiver_lang: mySetup.receiver_lang,
    };

    if (mySetup.deadline !== null) {
      let manifiedDeadline = null;

      if (mySetup.deadline === 7 || mySetup.deadline === 30) {
        manifiedDeadline = dateAddDays(new Date(), mySetup.deadline);
      } else {
        manifiedDeadline = new Date(mySetup.deadline);
      }

      setupPara.deadline = getUnix(manifiedDeadline);
      setupPara.expire_remind = mySetup.expire_remind;
      setupPara.remind_days_before_expire = mySetup.remind_days_before_expire;
    } else {
      setupPara.deadline = null;
    }

    postSetup(setupPara);
  };

  if (!mySetup) {
    return null;
  }

  return (
    <InfoComponent
      isLoading={isLoading}
      isOrder={isOrder}
      forget_remind={mySetup.forget_remind}
      need_otp_verify={mySetup.need_otp_verify}
      deadline={mySetup.deadline}
      expire_remind={mySetup.expire_remind}
      remind_days_before_expire={mySetup.remind_days_before_expire}
      receiver_lang={mySetup.receiver_lang}
      assignes={involved}
      ccInfos={ccInfos}
      message={mySetup.message}
      completedMessage={mySetup.completed_message}
      references={reference_setting}
      completedReferences={completed_reference_setting}
      msgRequestReceivers={msgRequestReceivers}
      msgCompletedReceivers={msgCompletedReceivers}
      isPermissionsButton={isPermissionsButton}
      isInfoUpdate={isInfoUpdate}
      onModalClose={onModalClose}
      onSignerPermissions={onSignerPermissions}
      onSettingChange={onSettingChange}
      onAuthIdentity={onAuthIdentity}
      onConfirm={onModify}
      isInfoFix
      isFileInfo={data?.isFileInfo}
    />
  );
};

export default TaskInfoUpdate;
