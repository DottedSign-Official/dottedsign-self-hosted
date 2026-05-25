import React from "react";
import { useDispatch } from "react-redux";
import { openModal as openModalAction } from "../../../../redux/actions/common";
import { useTranslation } from "next-i18next";
import { MODAL_TYPE } from "../../../../constants/constants";
import Btn from "../../../Button";
import { WrapperSub, WrapperItem } from "../../styled";

const ActionInfo = () => {
  const { t } = useTranslation("common");

  const dispatch = useDispatch();
  const openModal = (data) => dispatch(openModalAction(data));
  const onInfo = () => {
    const payload = {
      modalType: MODAL_TYPE.taskInfoUpdate,
      modalData: {
        isFileInfo: true,
      },
    };
    openModal(payload);
  };

  return (
    <WrapperSub>
      <WrapperItem>
        <Btn type="primaryFlex" handleEvent={onInfo}>
          {t("file_info")}
        </Btn>
      </WrapperItem>
    </WrapperSub>
  );
};

export default ActionInfo;
