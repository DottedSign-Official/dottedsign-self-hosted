import React from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { openModal as openModalAction } from "../../../../redux/actions/common";
import { MODAL_TYPE } from "../../../../constants/constants";
import Btn from "../../../Button";
import { WrapperSub, WrapperItem } from "../../styled";

const ActionInfo = () => {
  const { t } = useTranslation("common");

  const dispatch = useDispatch();
  const openModal = (data) => dispatch(openModalAction(data));
  const onFinish = () => {
    const payload = { modalType: MODAL_TYPE.reviewPassedConfirm };
    openModal(payload);
  };

  return (
    <WrapperSub>
      <WrapperItem>
        <Btn type="primaryFlex" handleEvent={onFinish}>
          {t("guide_sign_btn_finish")}
        </Btn>
      </WrapperItem>
    </WrapperSub>
  );
};

export default ActionInfo;
