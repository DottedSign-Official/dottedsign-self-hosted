import React, { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";
import { openModal as openModalAction } from "../../../../redux/actions/common";
import { MODAL_TYPE } from "../../../../constants/constants";
import { sleep, determineCorner, calculateHintPosition } from "./helper";

import Icon from "../../../Icon";
import Btn from "../../../Button";
import TagNumber from "../../../TagNumber";
import ReviewPanel from "../../../ReviewPanel";
import ReviewTooltip from "../../../ReviewTooltip";

import { HintBtn } from "../../../../global/styledBtn";
import { WrapperSub, WrapperItem, WrapperTag, GuideText } from "../../styled";
import { WrapperCheck, Back, Status, ButtonGroup } from "./styled";

const HintButton = ({ t, onModifyAll, onModifyRemaining, completedStatus }) => {
  const onClear = () => onModifyAll(null);

  if (completedStatus === "all_completed") {
    return <HintBtn onClick={onClear}>{t("clear_all")}</HintBtn>;
  }

  const { onModify, passText, failText } = (() => {
    if (completedStatus === "some_completed") {
      return {
        onModify: onModifyRemaining,
        passText: "pass_rest",
        failText: "fail_rest",
      };
    }
    return {
      onModify: onModifyAll,
      passText: "pass_all",
      failText: "fail_all",
    };
  })();

  return (
    <ButtonGroup>
      <HintBtn onClick={() => onModify(true)}>{t(passText)}</HintBtn>
      <HintBtn onClick={() => onModify(false)}>{t(failText)}</HintBtn>
    </ButtonGroup>
  );
};

const Hint = ({ t, onModifyAll, onModifyRemaining, completedStatus }) => {
  const container = document.getElementById("hint_reviewing");
  const content = (
    <HintButton
      t={t}
      onModifyAll={onModifyAll}
      onModifyRemaining={onModifyRemaining}
      completedStatus={completedStatus}
    />
  );
  if (!container || typeof container === "undefined") {
    return null;
  }
  return ReactDOM.createPortal(content, container);
};

const CompCheck = ({
  isActive,
  isHighlight,
  isSelectionField,
  isHyperlinkField,
  hintPosition,
  hintType,
  id,
  checkValue,
  onModify,
  onSetOrder,
  corner,
  fieldValue,
  t,
}) => {
  const dispatch = useDispatch();
  const openModal = (data) => dispatch(openModalAction(data));
  const refBlurTimer = useRef();
  const [isFocus, setIsFocus] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [val, setVal] = useState();

  useEffect(() => {
    setIsFocus(isActive);
  }, [isActive]);

  useEffect(() => {
    setVal(checkValue);
  }, [checkValue]);

  const onClick = () => {
    setIsFocus(true);
  };

  const onFocusHandler = () => {
    onSetOrder();
    if (refBlurTimer.current) {
      clearTimeout(refBlurTimer.current);
    }
  };

  const onBlurHandler = () => {
    refBlurTimer.current = setTimeout(() => {
      setIsFocus(false);
    });
  };

  const onCheck = (e) => {
    e.stopPropagation();
    onModify(true);
    setVal(true);
  };

  const onReturn = (e) => {
    e.stopPropagation();
    onModify(false);
    setVal(false);
  };

  const onLinkClick = () => {
    openModal({
      modalType: MODAL_TYPE.openLink,
      modalData: { link: fieldValue },
    });
  };

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

  return (
    <WrapperCheck
      id={id}
      tabIndex="10"
      isFocus={isFocus}
      onFocus={onFocusHandler}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onBlur={onBlurHandler}
      isHighlight={isHighlight}
    >
      <Back onClick={onClick} />

      {iconType && (
        <Status isSelectionField={isSelectionField}>
          <Icon type={iconType} size="18px" />
        </Status>
      )}

      {isHighlight && isHover && hintType && (
        <ReviewTooltip t={t} position={hintPosition} type={hintType} />
      )}

      {isFocus && (
        <ReviewPanel
          corner={corner}
          isHyperlinkField={isHyperlinkField}
          onCheck={onCheck}
          onReturn={onReturn}
          onLinkClick={isHyperlinkField ? onLinkClick : null}
        />
      )}
    </WrapperCheck>
  );
};

const Field = ({ isActive, rev, onModify, onSetOrder, viewport, t }) => {
  const [isIni, setIsIni] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [corner, setCorner] = useState(null);

  const isSelectionField =
    rev.field_type === "radio" || rev.field_type === "checkbox";
  const isHyperlinkField = rev.field_type === "link";

  useEffect(() => {
    (async () => {
      const id = `signInput-${rev.pdf_object_id}`;
      let counter = 0;
      let container = document.getElementById(id);

      while (!container && counter < 10) {
        await sleep(500);
        container = document.getElementById(id);
        counter += 1;
      }

      setIsIni(false);
      if (container) {
        setIsValid(true);
      }
    })();
  }, [rev.pdf_object_id]);

  useEffect(() => {
    const eleId = `signInput-${rev.pdf_object_id}`;
    const ele = document.getElementById(eleId);
    if (!ele) {
      return;
    }

    ele.style.zIndex = isActive ? 11 : 10;
  }, [isActive, rev.pdf_object_id]);

  useEffect(() => {
    if (isSelectionField && viewport[parseInt(rev.page)]) {
      const { width, height } = viewport[parseInt(rev.page)];
      setCorner(determineCorner(rev.coord, width, height));
    }
  }, [isSelectionField, rev.coord, rev.page, viewport]);

  if (isIni || !isValid) {
    return null;
  }

  const id = `signInput-${rev.pdf_object_id}`;
  const container = document.getElementById(id);
  if (!container) {
    return null;
  }

  const hintPosition = calculateHintPosition(rev, viewport, isSelectionField);

  const hintType = (() => {
    if (rev.isLastTimeChanged) {
      return "changed";
    }
    if (rev.isLastTimeFailed) {
      return "notChanged";
    }
    return "";
  })();

  const isHighlight = rev.isLastTimeChanged || rev.isLastTimeFailed;

  const content = (
    <CompCheck
      isActive={isActive}
      isHighlight={isHighlight}
      isSelectionField={isSelectionField}
      isHyperlinkField={isHyperlinkField}
      id={`checker-${rev.pdf_object_id}`}
      checkValue={rev.accepted}
      onModify={onModify(rev)}
      onSetOrder={() => onSetOrder(rev.order)}
      corner={corner}
      fieldValue={rev.field_value}
      hintPosition={hintPosition}
      hintType={hintType}
      t={t}
    />
  );

  return ReactDOM.createPortal(content, container);
};

const Fields = React.memo(
  ({ activeId, reviewFields, onModify, onSetOrder, viewport, t }) => {
    return reviewFields.map((rev, idx) => {
      return (
        <Field
          key={idx}
          isActive={idx === activeId}
          rev={rev}
          onModify={onModify}
          onSetOrder={onSetOrder}
          viewport={viewport}
          t={t}
        />
      );
    });
  },
);
Fields.displayName = "Fields";

const StatusReview = () => {
  const { t } = useTranslation("common");

  const [orderFocus, setOrderFocus] = useState(0);
  const [myReviewFields, setMyReviewFields] = useState(null);
  const [countCompleted, setCountCompleted] = useState(0);

  const { isRenderDone, viewport, scale } = useSelector((state) => state.pdf);
  const { reviewFields, reviewedMessage, viewable_attachments } = useSelector(
    (state) => state.sign,
  );
  const dispatch = useDispatch();
  const openModal = (data) => dispatch(openModalAction(data));

  useEffect(() => {
    if (reviewFields) {
      const sortByPosition = (a, b) => {
        if (a.page !== b.page) {
          return a.page - b.page;
        }
        return b.coord[3] - a.coord[3];
      };

      const sortedFields = [...reviewFields]
        .sort(sortByPosition)
        .map((field, idx) => ({
          ...field,
          order: idx,
        }));

      setMyReviewFields(sortedFields);
    }
  }, [reviewFields]);

  useEffect(() => {
    if (myReviewFields) {
      const count = myReviewFields.filter(
        (rev) => typeof rev.accepted === "boolean",
      ).length;

      setCountCompleted(count);
    }
  }, [myReviewFields]);

  useEffect(() => {
    if (!reviewedMessage) {
      return;
    }
    openModal({
      modalType: MODAL_TYPE.checkerMsg,
      modalData: { msg: reviewedMessage, isReviewing: true },
    });
  }, [reviewedMessage]);

  const onScrollNext = () => {
    const itmNext =
      myReviewFields.find(
        (rev) =>
          rev.order > orderFocus &&
          (rev.accepted === null || rev.accepted === undefined),
      ) ||
      // NOTE: find first not yet accepted review
      myReviewFields.find(
        (rev) => rev.accepted === null || rev.accepted === undefined,
      );

    if (itmNext === undefined) {
      return;
    }

    setOrderFocus(itmNext.order);

    // NOTE: scroll
    const wrapper = document.getElementById("viewer");
    const id = `signInput-${itmNext.pdf_object_id}`;
    const comp = document.getElementById(id);
    const page = itmNext.page;

    let scrollPos = 0;
    // NOTE: pg
    [...Array(page)].map(
      // NOTE: scale for viewport height & 20px for field height
      (_, idx) => (scrollPos += viewport[idx].height * scale + 20),
    );
    // NOTE: ele
    scrollPos += comp.offsetTop * scale;

    wrapper.scrollTo(0, scrollPos);

    // NOTE: focus
    const eleId = `checker-${itmNext.pdf_object_id}`;
    const ele = document.getElementById(eleId);
    if (!ele) {
      return;
    }
    ele.focus();
  };

  const onModify = (itm) => (val) => {
    const newReviewFields = myReviewFields.map((rev) => {
      if (rev.pdf_object_id === itm.pdf_object_id) {
        return {
          ...rev,
          accepted: val,
        };
      }

      return rev;
    });

    setMyReviewFields(newReviewFields);
  };

  const onModifyRemaining = (val) => {
    const newReviewFields = myReviewFields.map((rev) => {
      if (typeof rev.accepted === "boolean") {
        return rev;
      }
      return {
        ...rev,
        accepted: val,
      };
    });

    setMyReviewFields(newReviewFields);
  };

  const onModifyAll = (val) => {
    const newReviewFields = myReviewFields.map((rev) => {
      return {
        ...rev,
        accepted: val,
      };
    });

    if (val) {
      setOrderFocus(null);
    }
    if (!val) {
      setOrderFocus(0);
    }

    setMyReviewFields(newReviewFields);
  };

  if (!myReviewFields) {
    return null;
  }

  if (!isRenderDone) {
    return null;
  }

  // NOTE: all_completed | all_blank | some_completed
  const completedStatus = (() => {
    if (countCompleted === myReviewFields.length) {
      return "all_completed";
    } else if (countCompleted === 0) {
      return "all_blank";
    } else {
      return "some_completed";
    }
  })();

  const getBtnContent = () => {
    const req = countCompleted;
    const limit = myReviewFields.length;

    if (req < limit) {
      return {
        btnText: "guide_sign_btn_next",
        btnEvent: onScrollNext,
      };
    }

    return {
      btnText: "guide_sign_btn_finish",
      btnEvent: () =>
        openModal({
          modalType: MODAL_TYPE.checkConfirm,
          modalData: {
            fields: myReviewFields,
            attachments: viewable_attachments.filter((att) => att.reviewable),
          },
        }),
    };
  };

  const { btnText, btnEvent } = getBtnContent();

  return (
    <WrapperSub>
      <WrapperItem>
        <WrapperTag>
          <TagNumber indx={myReviewFields[0].seq} />
        </WrapperTag>

        <GuideText>{`${countCompleted} / ${myReviewFields.length}`}</GuideText>

        <Btn type="primaryFlex" handleEvent={btnEvent}>
          {t(btnText)}
        </Btn>
      </WrapperItem>

      <Fields
        activeId={orderFocus}
        reviewFields={myReviewFields}
        onSetOrder={setOrderFocus}
        onModify={onModify}
        viewport={viewport}
        t={t}
      />

      <Hint
        t={t}
        completedStatus={completedStatus}
        onModifyAll={onModifyAll}
        onModifyRemaining={onModifyRemaining}
      />
    </WrapperSub>
  );
};

export default StatusReview;
