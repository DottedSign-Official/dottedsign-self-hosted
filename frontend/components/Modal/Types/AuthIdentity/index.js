import { isReviewAction } from "../../../../helpers/assignees/review";
import { isFormSigner } from "../../../../helpers/assignees/publicForm";
import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";
import { openModal as openModalAction } from "../../../../redux/actions/common";
import { MODAL_TYPE } from "../../../../constants/constants";
import Icon from "../../../Icon";
import TagNumber from "../../../TagNumber";
import Verify from "./verify";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Content,
} from "../../../../global/styledModal";
import { Item, User, Name, Blank } from "./styled";
import { isTaiwanPhone as isPhone } from "../../../../helpers/utility";
import { openToast as openToastAction } from "../../../../redux/actions/common";
import { setAssignes as setAssignesAction } from "../../../../redux/actions/create";
import toastType from "../../../../constants/toast";

const AuthIdentity = ({ data }) => {
  const { isInfoUpdate } = data;
  const { t } = useTranslation("modal");

  const { assignes, assigneesWarnings } = useSelector((state) => state.create);
  const { stagesUpdate } = useSelector((state) => state.sign);

  const dispatch = useDispatch();
  const openModal = (data) => dispatch(openModalAction(data));
  const openToast = (data) => dispatch(openToastAction(data));
  const setAssignes = (data) => dispatch(setAssignesAction(data));

  const targets = isInfoUpdate ? stagesUpdate : assignes;

  const isPrevValid = (() => {
    const phoneValid = targets.every(({ verify }) => {
      const smsItm = verify?.find((itm) => itm.verify_type === "sms");
      if (typeof smsItm === "undefined") {
        return true;
      }
      return isPhone(smsItm.verify_source);
    });
    return phoneValid;
  })();

  const onPrev = () => {
    const modalType = (() => {
      // NOTE: task update
      if (isInfoUpdate) {
        return MODAL_TYPE.taskInfoUpdate;
      }

      // NOTE: create
      return MODAL_TYPE.createConfirm;
    })();

    openModal({
      modalType,
      modalData: { isRevert: true },
    });
  };

  const onPrevious = () => {
    if (!isPrevValid) {
      openToast({ payload: toastType.invalidPhone });
      return;
    }
    onPrev();
  };

  const getAssigneeSetter = (targetIndex) => {
    return (assignee) => {
      const newAssignees = assignes.map((target, idx) =>
        targetIndex === idx ? assignee : target,
      );
      setAssignes({ assignes: newAssignees });
    };
  };

  const [openedVerify, setOpenedVerify] = useState(null);

  const handleCollapseToggle = (idx) => {
    if (openedVerify === idx) {
      setOpenedVerify(null);
    } else {
      setOpenedVerify(idx);
    }
  };

  if (!targets || targets.length < 1) {
    return null;
  }

  return (
    <Wrapper width="580px">
      <Close onClick={onPrevious}>
        <Icon type="previous" />
      </Close>

      <Title>{t("identity_verify_methods")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          {targets.map((target, idx) => (
            <Item key={idx} $hidden={isReviewAction(target)}>
              <User>
                <TagNumber indx={target.key} />
                <Name>{`${target.name} (${
                  isFormSigner(target)
                    ? t("form_signer", { ns: "publicForm" })
                    : target.email
                })`}</Name>
              </User>

              <Verify
                setAssignee={getAssigneeSetter(idx)}
                myObj={target}
                isInfoUpdate={isInfoUpdate}
                isCollapse={openedVerify !== idx}
                onCollapseToggle={() => handleCollapseToggle(idx)}
                warningSystemCA={assigneesWarnings[target.uid]}
              />
            </Item>
          ))}

          <Blank />
        </Content>
      </Body>
    </Wrapper>
  );
};

export default AuthIdentity;
