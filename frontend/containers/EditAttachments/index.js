import React, { useEffect, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { openModal as openModalAction } from "../../redux/actions/common";
import { setAttachments as setAttachmentsAction } from "../../redux/actions/create";
import EditAttachments from "../../components/EditAttachments";
import { MODAL_TYPE } from "../../constants/constants";

const EditAttachmentContainer = ({ isViewOnly }) => {
  const { assignes, isEnvelope, fileFocus, attachments } = useSelector(
    (state) => state.create,
  );
  const [currentAssignees, setCurrentAssignees] = useState([]);
  const dispatch = useDispatch();
  const openModal = (data) => dispatch(openModalAction(data));
  const setAttachments = useCallback(
    (data) => dispatch(setAttachmentsAction(data)),
    [dispatch],
  );

  useEffect(() => {
    const assigneeChanged =
      JSON.stringify(currentAssignees) !== JSON.stringify(assignes);

    if (assigneeChanged && attachments) {
      let attaches = [];

      // NOTE: attachments should follow corresponded signer (i.e. uid)
      attachments.map((atta) => {
        const res = assignes.find((ass) => ass.uid === atta.signer.uid);
        if (res !== undefined && res) {
          attaches = [
            ...attaches,
            {
              ...atta,
              signer: res,
            },
          ];
          return;
        }
      });

      setAttachments({ attachments: attaches });
      setCurrentAssignees(assignes);
    }
  }, [assignes, attachments, setAttachments, currentAssignees]);

  const onAdd = () => {
    openModal({ modalType: MODAL_TYPE.attachmentField });
  };

  const onDel = (itm) => {
    let newAttachments = attachments.filter(
      (atta) => itm.attachment_id !== atta.attachment_id,
    );
    setAttachments({ attachments: newAttachments });
  };

  return (
    <EditAttachments
      isViewOnly={isViewOnly}
      isEnvelope={isEnvelope}
      fileFocus={fileFocus}
      attachments={attachments}
      onAdd={onAdd}
      onDel={onDel}
    />
  );
};

export default EditAttachmentContainer;
