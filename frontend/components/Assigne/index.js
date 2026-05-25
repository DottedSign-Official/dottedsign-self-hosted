import React, { useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import { STAGE_ACTION } from "../../constants/constants";
import Icon from "../Icon";
import TagNumber from "../TagNumber";

import tooltip from "../../constants/tooltip";
import Tooltip from "../../containers/Tooltip";
import InputAssigne from "../../containers/InputAssigne";
import InputRole from "../../containers/InputRole";
import { WrapperList } from "../../global/styledCreate";
import {
  TagCheck,
  ColTagNumber,
  ColName,
  ColEmail,
  ColDelete,
  ColMore,
  ColMove,
  OrderNumLinkBar,
  Role,
} from "./styled";

const Assigne = ({
  isMe,
  isReadOnly,
  isTag,
  isOrderBar,
  isNameOnly,
  isModal,
  isMore,
  isDraggable,
  isDeletable,
  isTemplateApplied,
  isPublicForm,
  isMoreWarning,
  keyIndex,
  allItems = [],
  item,
  onModify,
  onDelete,
  position,
  onMore,
  listeners,
}) => {
  const { t } = useTranslation("publicForm");
  const refFocus = useRef(null);
  const [tagFocus, setTagFocus] = useState(null);

  const onFocus = (tag, status) => {
    if (!status) {
      // NOTE: blur
      if (refFocus.current && refFocus.current !== tag) {
        // NOTE: others already focus
        return;
      }

      setTagFocus(null);
      refFocus.current = null;
      return;
    }

    setTagFocus(tag);
    refFocus.current = tag;
    return;
  };

  const hasReviewer = (() => {
    if (allItems.length === 0) {
      return false;
    }

    if (item.action === STAGE_ACTION.review) {
      return false;
    }

    return allItems.some(
      (ass) =>
        ass.action === STAGE_ACTION.review &&
        ass.actor_info?.base_uid === item.uid,
    );
  })();

  return (
    <WrapperList isFocus={tagFocus} tabIndex={tagFocus ? 10001 : 10000}>
      {isOrderBar && <OrderNumLinkBar />}

      <ColTagNumber>
        {isTag ? <TagNumber indx={keyIndex} /> : <TagNumber />}

        {hasReviewer && (
          <TagCheck>
            <Tooltip type={tooltip.review} position="top" />
          </TagCheck>
        )}
      </ColTagNumber>

      <ColName isFull={isNameOnly} isModal={isModal}>
        {isNameOnly || item?.signer_type === "form_signer" ? (
          <InputRole
            index={`56${keyIndex}0`}
            item={item}
            onModify={onModify}
            isReadOnly={isReadOnly}
            onParentFocus={onFocus}
          />
        ) : (
          <InputAssigne
            index={`56${keyIndex}0`}
            tag="name"
            position={position}
            isMe={isMe}
            item={item}
            onModify={onModify}
            isReadOnly={isReadOnly}
            onParentFocus={onFocus}
          />
        )}
      </ColName>

      {item?.signer_type === "form_signer" ? (
        <ColEmail isModal={isModal}>
          <Role>{t("form_signer")}</Role>
        </ColEmail>
      ) : !isNameOnly ? (
        <ColEmail isModal={isModal}>
          <InputAssigne
            index={`56${keyIndex}1`}
            tag="email"
            position={position}
            isMe={isMe}
            item={item}
            onModify={onModify}
            isReadOnly={isReadOnly}
            onParentFocus={onFocus}
          />
        </ColEmail>
      ) : null}

      <ColMore
        onClick={isMore ? () => onMore({ ...item, isMoreWarning }) : () => {}}
        isWarning={isMoreWarning}
      >
        {isMore && <Icon type="more" />}
      </ColMore>

      {!isReadOnly &&
        (!isTemplateApplied || (isTemplateApplied && isPublicForm)) && (
          <>
            {isDeletable && (
              <ColDelete onClick={() => onDelete(item)}>
                <Icon type="cancel" />
              </ColDelete>
            )}

            <ColMove {...(isDraggable ? listeners : {})}>
              {isDraggable && <Icon type="drag" />}
            </ColMove>
          </>
        )}
    </WrapperList>
  );
};

export default Assigne;
