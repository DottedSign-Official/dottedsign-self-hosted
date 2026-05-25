import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";

import Icon from "../../../Icon";
import { openModal } from "../../../../redux/actions/common";
import { MODAL_TYPE } from "../../../../constants/constants";
import { Wrapper, WrapperIcon, Menu, Item } from "./styled";

const Attachment = () => {
  const { t } = useTranslation("common");
  const refTimer = useRef();
  const dispatch = useDispatch();

  const {
    viewable_attachments,
    isEnvelope,
    fileFocus,
    fileList,
    reviewedAttachments,
  } = useSelector((state) => state.sign);

  const [isCollapse, setIsCollapse] = useState(true);

  const onFocus = () => {
    clearTimeout(refTimer.current);
  };

  const onBlur = () => {
    refTimer.current = setTimeout(() => {
      setIsCollapse(true);
    });
  };

  const onToggle = () => {
    setIsCollapse(!isCollapse);
  };

  const onView = () => {
    if (viewable_attachments) {
      dispatch(
        openModal({
          modalType: MODAL_TYPE.attachmentViewer,
          modalData: {
            viewable_attachments,
            reviewedAttachments,
            isEnvelope,
            fileFocus,
            fileList,
          },
        }),
      );
    }
  };

  const isAttachmentChanged = reviewedAttachments?.some(
    (att) => att.isLastTimeChanged,
  );
  const isAttachmentFailed = reviewedAttachments?.some(
    (att) => att.isLastTimeFailed,
  );

  const isAttachment = viewable_attachments && viewable_attachments.length > 0;
  const isViewable = isAttachment;

  if (!isViewable) {
    return null;
  }

  return (
    <Wrapper tabIndex="9" onFocus={onFocus} onBlur={onBlur}>
      <WrapperIcon
        isHighlight={isAttachmentChanged || isAttachmentFailed}
        onClick={onToggle}
      >
        <Icon type="attachment" />
      </WrapperIcon>
      {!isCollapse && (
        <Menu>
          {isViewable && (
            <Item onClick={onView}>
              <Icon type="search" />
              <p>{t("view_attachment")}</p>
            </Item>
          )}
        </Menu>
      )}
    </Wrapper>
  );
};

export default Attachment;
