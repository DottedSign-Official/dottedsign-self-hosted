import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";
import { setAssignes as setAssignesAction } from "../../../../redux/actions/create";
import {
  openToast as openToastAction,
  openModal as openModalAction,
} from "../../../../redux/actions/common";
import {
  setSignerSettingsParams as setSignerSettingsParamsAction,
  clearSignerSettingsParams as clearSignerSettingsParamsAction,
} from "../../../../redux/actions/modalCache";
import { isEmail } from "../../../../helpers/utility";
import toastStatus from "../../../../constants/toast";
import { MODAL_TYPE, STAGE_ACTION } from "../../../../constants/constants";

import Button from "../../../Button";
import Checkbox from "../../../Checkbox";
import Icon from "../../../Icon";
import Verify from "./verify";
import Review from "./review";

import { DividerBtn } from "../../../../global/styled";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Content,
  Panel,
} from "../../../../global/styledModal";
import { Block, Label, Hint, Item, ItemText } from "./styled";

const PublicFormSettings = ({
  t,
  myObj,
  isLoading,
  isReadOnly,
  isRoleSwitchable,
  onRoleClick,
  onBackup,
  onRequiredClick,
  onTurnOff,
  onConfirm,
}) => {
  const isNameRequired = myObj.requisite?.name === "required";
  const isEmailRequired = myObj.requisite?.email === "required";
  const isInValid =
    myObj.signer_type === "form_signer"
      ? isLoading || !(isNameRequired || isEmailRequired)
      : isLoading;

  return (
    <Wrapper width="500px">
      <Close onClick={isLoading ? () => {} : onTurnOff}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_signer_advance_title")}</Title>
      <Body>
        <Content>
          <Block>
            <Label>{t("current_role")}</Label>
            <Item>
              <Checkbox
                isChecked={myObj.signer_type !== "form_signer"}
                isReadOnly={isReadOnly || !isRoleSwitchable}
                onToggle={() => onRoleClick(null)}
                isRadio
              />
              <ItemText>{t("signer")}</ItemText>
            </Item>
            <Item>
              <Checkbox
                isChecked={myObj.signer_type === "form_signer"}
                isReadOnly={isReadOnly || !isRoleSwitchable}
                onToggle={() => onRoleClick("form_signer")}
                isRadio
              />
              <ItemText>{t("form_signer", { ns: "publicForm" })}</ItemText>
            </Item>
          </Block>

          {myObj.signer_type === "form_signer" && (
            <Block>
              <Label>{t("require_contact_info")}</Label>
              <Item>
                <Checkbox
                  isChecked={isNameRequired}
                  isReadOnly={isReadOnly}
                  onToggle={() => onRequiredClick("name")}
                />
                <ItemText>{t("name")}</ItemText>
              </Item>
              <Item>
                <Checkbox
                  isChecked={isEmailRequired}
                  isReadOnly={isReadOnly}
                  onToggle={() => onRequiredClick("email")}
                />
                <ItemText>{t("email")}</ItemText>
              </Item>
            </Block>
          )}

          {(myObj.signer_type !== "form_signer" || isEmailRequired) && (
            <Verify myObj={myObj} onBackup={onBackup} isReadOnly={isReadOnly} />
          )}
        </Content>
      </Body>

      {!isReadOnly && (
        <Panel>
          <Button type="cancel" handleEvent={isLoading ? () => {} : onTurnOff}>
            {t("btn_cancel")}
          </Button>
          <DividerBtn />
          <Button
            type={isInValid ? "disabled" : "primaryFlex"}
            handleEvent={isInValid ? null : onConfirm}
          >
            {t("btn_confirm")}
          </Button>
        </Panel>
      )}
    </Wrapper>
  );
};

const SignerSettings = ({ onModalClose }) => {
  const { t } = useTranslation("modal");

  const [isInit, setIsInit] = useState(true);
  const [myObj, setMyObj] = useState(null);
  const [reviewers, setReviewers] = useState([]);
  const [isAssignesInvalid, setIsAssignesInvalid] = useState(true);
  const [isRoleSwitchable, setIsRoleSwitchable] = useState(true);

  const { user } = useSelector((state) => state.auth);
  const {
    isSignerSettingsReadOnly,
    signerSettingsPosition,
    signerSettingsUid,
    signerSettingsWarningSystemCA,
    signerSettingsSigners,
  } = useSelector((state) => state.modalCache);
  const {
    isLoading,
    isTemplate,
    isOrder,
    isEnvelope,
    isImportedTemplateReadOnly,
    isPublicForm,
  } = useSelector((state) => state.create);

  const dispatch = useDispatch();
  const openToast = (data) => dispatch(openToastAction(data));
  const openModal = (data) => dispatch(openModalAction(data));
  const setAssignes = (data) => dispatch(setAssignesAction(data));
  const setSignerSettingsParams = (data) =>
    dispatch(setSignerSettingsParamsAction(data));
  const clearSignerSettingsParams = () =>
    dispatch(clearSignerSettingsParamsAction());

  const uid = signerSettingsUid;
  const warningSystemCA = signerSettingsWarningSystemCA;
  const signers = signerSettingsSigners;
  const setSigners = setAssignes;

  const isReadOnly = isSignerSettingsReadOnly || isImportedTemplateReadOnly;
  const isSkipConfirmReadOnly = (() => {
    if (!myObj) {
      return true;
    }
    if (isReadOnly) {
      return true;
    }
    if (
      ["cht_personal", "cht_company", "cht_system"].includes(
        myObj.verify?.[0]?.verify_type,
      )
    ) {
      return true;
    }
    return false;
  })();

  useEffect(() => {
    // NOTE: init myObj
    if (user && signers && uid) {
      const signer = signers.find((ass) => ass.uid === uid);
      if (signer) {
        setMyObj({ ...signer, verify: signer.verify || [] });
      }
    }
  }, [user, signers, uid]);

  useEffect(() => {
    if (isEnvelope) {
      setIsInit(false);
      return;
    }

    // NOTE: init reviewers
    if (isInit && myObj && signers) {
      const initReviewers = signers.filter(
        (ass) =>
          ass.action === "review" && ass.actor_info?.base_uid === myObj.uid,
      );
      setReviewers(initReviewers);
      setIsInit(false);
    }
  }, [myObj, signers, isInit, isEnvelope]);

  useEffect(() => {
    if (isEnvelope) {
      setIsAssignesInvalid(false);
      return;
    }

    const invalidItems = reviewers.filter((reviewer) => {
      if (isTemplate) {
        return !reviewer.role || reviewer.role === "";
      }
      return (
        !reviewer.name ||
        !reviewer.email ||
        reviewer.name === "" ||
        reviewer.email === "" ||
        !isEmail(reviewer.email)
      );
    });

    setIsAssignesInvalid(invalidItems.length > 0);
  }, [reviewers, isTemplate, isEnvelope]);

  useEffect(() => {
    if (myObj && isPublicForm) {
      setIsRoleSwitchable(false);
    }
  }, [myObj, isPublicForm]);

  const onRoleClick = (role) => {
    const newObj = Object.assign({}, myObj);
    newObj.signer_type = role;
    if (role === "form_signer") {
      newObj.requisite = {
        name: "required",
        email: "optional",
      };
    } else {
      delete newObj.requisite;
    }

    setMyObj(newObj);
  };
  const onRequiredClick = (field) => {
    setMyObj((prevObj) => {
      const newRequisite = { ...prevObj.requisite };
      newRequisite[field] =
        newRequisite[field] === "required" ? "optional" : "required";
      const shouldClearVerify =
        field === "email" && newRequisite.email !== "required";

      return {
        ...prevObj,
        requisite: newRequisite,
        ...(shouldClearVerify ? { verify: [] } : {}),
      };
    });
  };

  const onToggleSkipConfirm = () => {
    const valSkipConfirm = myObj?.stage_setting?.reviewed_skip_confirm;

    setMyObj({
      ...myObj,
      stage_setting: {
        ...myObj.stage_setting,
        reviewed_skip_confirm: !valSkipConfirm,
      },
    });
  };

  const onFilter = () => {
    const newSigner = {
      ...myObj,
    };

    // NOTE: 1. find
    const signerIndex = signers.findIndex(
      (ass) => ass.uid === myObj.uid && ass.action !== STAGE_ACTION.review,
    );

    // NOTE: 2. filter
    const filtered = signers.filter(
      (ass) =>
        ass.action !== STAGE_ACTION.review ||
        ass.actor_info?.base_uid !== myObj.uid,
    );

    // NOTE: 3. insert
    let nextAssignes = [
      ...filtered.slice(0, signerIndex),
      newSigner,
      ...reviewers,
      ...filtered.slice(signerIndex + 1),
    ];
    // NOTE: reset key
    nextAssignes = nextAssignes.map((item, index) => ({
      ...item,
      key: index,
    }));

    return nextAssignes;
  };

  const onBackup = () => {
    const newSigners = onFilter();
    setSignerSettingsParams({ signerSettingsSigners: newSigners });
  };

  const onTurnOff = () => {
    clearSignerSettingsParams();

    if (signerSettingsPosition === "assignFields") {
      openModal({
        modalType: MODAL_TYPE.manageSigners,
      });
      return;
    }

    onModalClose();
  };

  const handleSignerUpdate = () => {
    const newAssignes = onFilter();
    setSigners({ assignes: newAssignes });
    onTurnOff();
  };

  const onConfirm = () => {
    if (isAssignesInvalid) {
      openToast({ payload: toastStatus.checkFal });
      return;
    }

    handleSignerUpdate();
  };

  if (!myObj) {
    return null;
  }

  if (isPublicForm) {
    return (
      <PublicFormSettings
        t={t}
        myObj={myObj}
        isLoading={isLoading}
        isReadOnly={isReadOnly}
        isRoleSwitchable={isRoleSwitchable}
        onRoleClick={onRoleClick}
        onBackup={onBackup}
        onRequiredClick={onRequiredClick}
        onTurnOff={onTurnOff}
        onConfirm={onConfirm}
      />
    );
  }

  return (
    <Wrapper width="580px">
      <Close onClick={isLoading ? () => {} : onTurnOff}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_signer_advance_title")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          {!isTemplate && (
            <Verify
              warningSystemCA={warningSystemCA}
              onBackup={onBackup}
              myObj={myObj}
            />
          )}

          {/* NOTE: Hide Review component in envelope mode */}
          {!isEnvelope && (
            <Review
              isTemplate={isTemplate}
              reviewers={reviewers}
              setReviewers={setReviewers}
              myObj={myObj}
              isOrder={isOrder}
            />
          )}

          {/* NOTE: Hide skip_confirm block in envelope mode */}
          {!isEnvelope && (
            <Block>
              <Label>{t("skip_confirm")}</Label>
              <Hint>
                <Icon type="tips" />
                <p>{t("skip_confirm_hint")}</p>
              </Hint>
              <Item>
                <Checkbox
                  isChecked={myObj.stage_setting?.reviewed_skip_confirm}
                  onToggle={onToggleSkipConfirm}
                  isReadOnly={isSkipConfirmReadOnly}
                />
                <ItemText>{t("skip_confirm_desc")}</ItemText>
              </Item>
            </Block>
          )}
        </Content>
      </Body>

      <Panel>
        <Button type="cancel" handleEvent={isLoading ? () => {} : onTurnOff}>
          {t("btn_cancel")}
        </Button>
        <DividerBtn />
        <Button type="primaryFlex" handleEvent={!isLoading && onConfirm}>
          {t("btn_confirm")}
        </Button>
      </Panel>
    </Wrapper>
  );
};

export default SignerSettings;
