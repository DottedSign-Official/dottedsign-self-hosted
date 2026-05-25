import React from "react";
import { useTranslation } from "next-i18next";
import { Wrapper, Close, Title, Body } from "../../../../global/styledModal";
import { Content } from "./styled";
import Icon from "../../../Icon";
import { Input } from "../../../../global/styledForm";
import Button from "../../../Button";
import { useDispatch } from "react-redux";
import { openToast } from "../../../../redux/actions/common";
import { OPEN_TOAST } from "../../../../constants/commonTypes";
import toastStatus from "../../../../constants/toast";

const PreviewShareLink = ({ onModalClose, data: { previewShareLink } }) => {
  const { t } = useTranslation("modal");
  const dispatch = useDispatch();

  const onCopy = () => {
    try {
      navigator.clipboard.writeText(previewShareLink);

      dispatch(
        openToast({
          type: OPEN_TOAST,
          data: {
            text: "copy_suc",
            isWarning: false,
          },
        }),
      );
    } catch (e) {
      console.error(e);
      dispatch(
        openToast({
          type: OPEN_TOAST,
          payload: toastStatus.commonError,
        }),
      );
    }
  };

  return (
    <Wrapper width="470px">
      <Close onClick={onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_preview_share_link")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          <Input value={previewShareLink || ""} width="80%" readOnly />
          <Button type="cancel" handleEvent={onCopy}>
            {t("btn_copy")}
          </Button>
        </Content>
      </Body>
    </Wrapper>
  );
};

export default PreviewShareLink;
