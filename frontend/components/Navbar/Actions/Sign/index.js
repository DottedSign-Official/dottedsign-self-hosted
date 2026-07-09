import React, { useState, useEffect, useRef, useMemo } from "react";
import ReactDOM from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";
import * as commonActions from "../../../../redux/actions/common";
import {
  setFileFocus as setFileFocusSignAction,
  setPageInvolvers as setPageInvolversAction,
  setFileUrl as setFileUrlSignAction,
} from "../../../../redux/actions/sign";
import { scrollToDom } from "../../../../helpers/dom";
import { filterPageInvolversByFileId } from "../../../../helpers/task";
import { MODAL_TYPE } from "../../../../constants/constants";
import Icon from "../../../Icon";
import Btn from "../../../Button";
import TagNumber from "../../../TagNumber";
import { WrapperAttaBtn, Status } from "./styled";
import { WrapperSub, WrapperTag, WrapperItem, GuideText } from "../../styled";

const Fields = React.memo(({ reviewFields }) => {
  if (!reviewFields) {
    return null;
  }

  return reviewFields.map((rev) => <Field key={rev.pdf_object_id} rev={rev} />);
});
Fields.displayName = "Fields";

const Field = ({ rev }) => {
  const refTimer = useRef(null);
  const refCounter = useRef(null);
  const [container, setContainer] = useState(null);
  const id = `signInput-${rev.pdf_object_id}`;

  useEffect(() => {
    refCounter.current = 1;

    refTimer.current = setInterval(() => {
      const comp = document.getElementById(`${id}`);
      setContainer(comp);
      refCounter.current += 1;

      if (refCounter.current === 5) {
        clearInterval(refTimer.current);
      }
    }, 500);

    return () => {
      if (refTimer.current) {
        clearInterval(refTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (container && refTimer.current) {
      clearInterval(refTimer.current);
    }
  }, [container]);

  if (container) {
    return <CompRev rev={rev} />;
  }

  return null;
};

const CompRev = ({ rev }) => {
  const isSelectionField =
    rev.field_type === "radio" || rev.field_type === "checkbox";

  const container = document.getElementById(`signInput-${rev.pdf_object_id}`);
  const content = (
    <CompIcon val={rev.accepted} isSelectionField={isSelectionField} />
  );

  return ReactDOM.createPortal(content, container);
};

const CompIcon = ({ val, isSelectionField }) => {
  const iconType = (() => {
    switch (val) {
      case true:
        return "accepted";
      case false:
        return "refused";
      default:
        return null;
    }
  })();

  if (!iconType) {
    return null;
  }

  return (
    <Status isSelectionField={isSelectionField}>
      <Icon type={iconType} size="18px" />
    </Status>
  );
};

const StatusSign = ({ data: { colorId, requiredIds } }) => {
  const { t } = useTranslation("common");

  const [blkRequired, setBlkRequired] = useState(requiredIds);
  const [filledRequired, setFilledRequired] = useState([]);
  const [requiredSigCountMap, setRequiredSigCountMap] = useState({});
  const [signedSigCountMap, setSignedSigCountMap] = useState({});
  const [signNumber, setSignNumber] = useState(0);
  const [shouldScroll, setShouldScroll] = useState(false);

  const prevBlkRequiredRef = useRef([]);

  const {
    appliedSigns,
    attachments,
    fileFocus,
    fileList,
    isEnvelope,
    reviewResults,
    reviewedMessage,
    allFilesInvolvers,
    taskBlocks: rawTaskBlocks,
  } = useSelector((state) => state.sign);
  const taskBlocks = useMemo(
    () => rawTaskBlocks.filter((blk) => blk.isMyTurn),
    [rawTaskBlocks],
  );
  const { isRenderDone } = useSelector((state) => state.pdf);
  const dispatch = useDispatch();
  const openModal = (data) => dispatch(commonActions.openModal(data));
  const setFileFocus = (ff) => dispatch(setFileFocusSignAction(ff));
  const setPageInvolvers = (pi) => dispatch(setPageInvolversAction(pi));
  const setFileUrl = (url) => dispatch(setFileUrlSignAction(url));

  useEffect(() => {
    setSignNumber(0);
  }, [fileFocus]);

  useEffect(() => {
    const blkRequiredTemp = [];
    taskBlocks.map((stage) => {
      if (
        (stage.status !== "processing" && stage.status !== "modifying") ||
        !stage.blocks
      ) {
        return;
      }

      stage.blocks.map((blk, idx) => {
        const groupId = blk.field_group_object_id;

        const item = {
          order: idx,
          ...blk,
          stageId: stage.stageId,
        };

        if (blk.options.force) {
          blkRequiredTemp.push(item);
          return;
        }

        // NOTE: groups
        if (!groupId || !stage.fieldGroups) {
          return;
        }

        const groupInboxItem = blkRequiredTemp.find(
          (blkTemp) => blkTemp.field_group_object_id === groupId,
        );

        if (typeof groupInboxItem !== "undefined") {
          return;
        } // NOTE: already saved

        const groupCurrent = stage.fieldGroups.find(
          (gp) => gp.field_group_object_id === groupId,
        );

        if (typeof groupCurrent === "undefined") {
          return;
        }

        const isRequired = groupCurrent.options?.force;

        if (isRequired) {
          blkRequiredTemp.push(item);
        }
      });
    });

    if (isEnvelope) {
      const requiredSigCountMap = blkRequiredTemp.reduce((acc, blk) => {
        if (!blk.taskId) {
          return acc;
        }
        acc[blk.taskId] = (acc[blk.taskId] || 0) + 1;
        return acc;
      }, {});
      setRequiredSigCountMap(requiredSigCountMap);
    }

    const sortByPosition = (a, b) => {
      if (a.page !== b.page) {
        return a.page - b.page;
      }
      return b.coord[3] - a.coord[3];
    };

    const newBlkRequired = isEnvelope
      ? blkRequiredTemp
          .filter((blk) => blk.taskId === fileFocus?.fileId)
          .sort(sortByPosition)
          .map((blk, idx) => ({
            ...blk,
            order: idx,
          }))
      : blkRequiredTemp.sort(sortByPosition);

    setBlkRequired(newBlkRequired);
  }, [taskBlocks, isEnvelope, fileFocus]);

  useEffect(() => {
    const isModifying = reviewResults && reviewedMessage;
    if (isModifying) {
      openModal({
        modalType: MODAL_TYPE.checkerMsg,
        modalData: { msg: reviewedMessage },
      });
    }
  }, [reviewResults]);

  useEffect(() => {
    const fieldGroups = (() => {
      const stage = taskBlocks.find(
        (blk) => blk.status === "processing" || blk.status === "modifying",
      );

      if (typeof stage === "undefined") {
        return [];
      }

      return stage.fieldGroups || [];
    })();

    const reqIndividual = [];
    const reqGroup = [];
    const groupInboxArr = [];

    const isFieldFilled = (sig) => sig.obj.raw;

    appliedSigns.map((sig) => {
      const groupId = sig.field_group_object_id;

      if (!isFieldFilled(sig)) {
        return;
      }

      // NOTE: individual
      if (typeof groupId === "undefined" || !groupId) {
        if (!sig.options.force) {
          return;
        }

        reqIndividual.push(sig);
        return;
      }

      // NOTE: groups
      if (groupInboxArr.indexOf(groupId) > -1) {
        return;
      } // NOTE: already saved

      const groupCurrent = fieldGroups.find(
        (group) => group.field_group_object_id === groupId,
      );

      if (typeof groupCurrent === "undefined") {
        return;
      }
      if (!groupCurrent.options) {
        return;
      }
      if (!groupCurrent.options.force) {
        return;
      }

      groupInboxArr.push(groupId);
      reqGroup.push(sig);
      return;
    });

    const reqblks = [...reqIndividual, ...reqGroup];

    if (isEnvelope) {
      const signedSigCountMap = reqblks.reduce((acc, sig) => {
        if (isFieldFilled(sig) && sig.taskId) {
          acc[sig.taskId] = (acc[sig.taskId] || 0) + 1;
        }
        return acc;
      }, {});
      setSignedSigCountMap(signedSigCountMap);
    }

    const newFilledRequired = isEnvelope
      ? reqblks
          .filter((blk) => blk.taskId === fileFocus?.fileId)
          .map((blk, idx) => ({
            ...blk,
            order: idx,
          }))
      : reqblks;

    setFilledRequired(newFilledRequired);
  }, [appliedSigns, taskBlocks, fileFocus, isEnvelope]);

  // NOTE: scroll to first required block after changeFileEvent
  useEffect(() => {
    if (!shouldScroll) {
      return;
    }

    const prevBlkRequired = prevBlkRequiredRef.current;

    const isBlkRequiredChanged =
      JSON.stringify(prevBlkRequired) !== JSON.stringify(blkRequired);

    if (!isBlkRequiredChanged) {
      return;
    }

    const timer = setTimeout(() => {
      scrollEvent(blkRequired, 0);
      setShouldScroll(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [shouldScroll, blkRequired]);

  // NOTE: useRef to keep the previous blkRequired state
  useEffect(() => {
    prevBlkRequiredRef.current = blkRequired;
  }, [blkRequired]);

  const isAttachment = attachments && attachments.length > 0;

  const isCurrentSignatureCompleted = () => {
    const requiredSignatureCount = requiredSigCountMap[fileFocus.fileId];
    const signedSignatureCount = signedSigCountMap[fileFocus.fileId];
    return signedSignatureCount === requiredSignatureCount;
  };

  const isAllSignatureCompleted = () => {
    const allSigned = fileList.every((f) => {
      const requiredSignatureCount = requiredSigCountMap[f.fileId];
      const signedSignatureCount = signedSigCountMap[f.fileId];
      return signedSignatureCount === requiredSignatureCount;
    });

    return allSigned;
  };

  const scrollEvent = (target, signNumber) => {
    const blk = target[signNumber];
    const groupId = blk?.field_group_object_id;
    const inputId = groupId ? groupId : `signInput-${blk?.id}`;
    scrollToDom(inputId, true);
    setSignNumber((prev) => (prev + 1) % target.length);
  };

  const changeFileEvent = () => {
    const firstFileNotSigned = fileList.find((f) => {
      const requiredSignatureCount = requiredSigCountMap[f.fileId];
      const signedSignatureCount = signedSigCountMap[f.fileId];
      return signedSignatureCount !== requiredSignatureCount;
    });
    const firstFileNotUploadRequiredAtta = fileList.find((f) => {
      return attachments.find(
        (att) => att.envelope_file_id === f.fileId && att.force && !att.file,
      );
    });

    const changeFile = firstFileNotSigned || firstFileNotUploadRequiredAtta;

    setFileUrl({ url: changeFile.fileUrl });
    setFileFocus(changeFile);
    // NOTE: page Involver
    setPageInvolvers(
      filterPageInvolversByFileId(allFilesInvolvers, changeFile.fileId),
    );
    setShouldScroll(true);
  };

  const getAttaBtnContent = () => {
    if (isEnvelope && isAttachment) {
      const isAttachmentForFocusTask = attachments.find(
        (att) => att.envelope_file_id === fileFocus.fileId,
      );
      const isAttachmentRequiredForFocusTask = attachments.find(
        (att) =>
          att.envelope_file_id === fileFocus.fileId && att.force && !att.file,
      );
      if (
        isAttachmentForFocusTask &&
        isAttachmentRequiredForFocusTask &&
        isCurrentSignatureCompleted()
      ) {
        return {
          isAttaVisible: false,
        };
      } else if (isAttachmentForFocusTask) {
        return {
          isAttaVisible: true,
          attaBtnText: "guide_attachment",
          attaBtnEvent: () =>
            openModal({ modalType: MODAL_TYPE.attachmentUpload }),
        };
      }
    }
    return {
      isAttaVisible: false,
    };
  };

  const getBtnContent = () => {
    const req = filledRequired.length;
    const limit = blkRequired.length;

    if (isEnvelope) {
      if (!isCurrentSignatureCompleted()) {
        return {
          isVisible: true,
          btnText: "guide_sign_btn_next",
          btnEvent: () => scrollEvent(blkRequired, signNumber),
        };
      }
      if (isAttachment) {
        const isAttachmentForFocusTask = attachments.find(
          (att) => att.envelope_file_id === fileFocus.fileId,
        );
        const isAttachmentRequiredForFocusTask = attachments.find(
          (att) =>
            att.envelope_file_id === fileFocus.fileId && att.force && !att.file,
        );
        if (isAttachmentForFocusTask && isAttachmentRequiredForFocusTask) {
          return {
            isVisible: true,
            btnText: "guide_attachment",
            btnEvent: () =>
              openModal({ modalType: MODAL_TYPE.attachmentUpload }),
          };
        }
      }

      const isAttachmentRequired = attachments.find(
        (att) => att.force && !att.file,
      );

      if (!isAllSignatureCompleted() || isAttachmentRequired) {
        return {
          isVisible: true,
          btnText: "guide_sign_file_next", //NOTE: next file
          btnEvent: () => changeFileEvent(),
        };
      }

      if (isAllSignatureCompleted() && !isAttachmentRequired) {
        return {
          isVisible: true,
          btnText: "guide_sign_file_finish",
          btnEvent: () => openModal({ modalType: MODAL_TYPE.signhereConfirm }),
        };
      }
    }

    if (req < limit) {
      return {
        isVisible: true,
        btnText: "guide_sign_btn_next",
        btnEvent: () => scrollEvent(blkRequired, signNumber),
      };
    }

    if (isAttachment) {
      return {
        isVisible: true,
        btnText: "guide_attachment",
        btnEvent: () => openModal({ modalType: MODAL_TYPE.attachmentUpload }),
      };
    }

    return {
      isVisible: true,
      btnText: "guide_sign_btn_finish",
      btnEvent: () => openModal({ modalType: MODAL_TYPE.signhereConfirm }),
    };
  };

  if (!blkRequired) {
    return null;
  }
  const { isAttaVisible, attaBtnText, attaBtnEvent } = getAttaBtnContent();
  const { isVisible, btnText, btnEvent } = getBtnContent();

  return (
    <WrapperSub>
      <WrapperItem>
        <WrapperTag>
          <TagNumber indx={colorId} />
        </WrapperTag>

        <GuideText>{`${filledRequired.length}/${blkRequired.length}`}</GuideText>

        {isAttaVisible && (
          <WrapperAttaBtn>
            <Btn
              type="primaryFlex"
              handleEvent={isRenderDone ? attaBtnEvent : () => {}}
            >
              {t(attaBtnText)}
            </Btn>
          </WrapperAttaBtn>
        )}

        {isVisible && (
          <Btn
            type="primaryFlex"
            handleEvent={isRenderDone ? btnEvent : () => {}}
          >
            {t(btnText)}
          </Btn>
        )}

        {appliedSigns.length > 0 && reviewResults?.reviewed_fields && (
          <Fields reviewFields={reviewResults.reviewed_fields} />
        )}
      </WrapperItem>
    </WrapperSub>
  );
};

export default StatusSign;
