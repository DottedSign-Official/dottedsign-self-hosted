import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "next-i18next";
import { useDispatch, useSelector } from "react-redux";

import ButtonWithLoading from "../../../ButtonWithLoading";
import Icon from "../../../Icon";
import CAEditForm from "./Form";
import { DividerBtn } from "../../../../global/styled";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Content,
  Panel,
} from "../../../../global/styledModal";
import {
  getSystemCADetail,
  updateSystemCA as updateSystemCAAction,
  deleteSystemCA as deleteSystemCAAction,
} from "../../../../redux/actions/admin";
import { openModal as openModalAction } from "../../../../redux/actions/common";
import { MODAL_TYPE } from "../../../../constants/constants";

import {
  useCommonValidators,
  useFormValidations,
} from "../../../../helpers/customHooks";

const CAEdit = ({ onModalClose, data: { id, user } }) => {
  const { t } = useTranslation("modal");

  const { systemCADetail, isLoading } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const openModal = (data) => dispatch(openModalAction(data));
  const updateSystemCA = (data) => dispatch(updateSystemCAAction(data));
  const deleteSystemCA = (data) => dispatch(deleteSystemCAAction(data));

  // NOTE: First init ca detail
  useEffect(() => {
    if (id && (systemCADetail === null || systemCADetail.id !== id)) {
      dispatch(getSystemCADetail({ id }));
    }
  }, [id, systemCADetail, dispatch]);

  const isFormDirtyRef = useRef(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [formState, setFormState] = useState(null);

  useEffect(() => {
    if (systemCADetail) {
      setFormState({
        name: systemCADetail.name,
        clusterId: systemCADetail.cluster_id,
        email: systemCADetail.email,
        token: systemCADetail.token,
        members: systemCADetail.members,
      });
    }
  }, [systemCADetail]);

  const { requiredValidator, emailValidator, trimValidator } =
    useCommonValidators();
  const fieldValidators = React.useMemo(
    () => ({
      name: [requiredValidator, trimValidator],
      clusterId: [requiredValidator, trimValidator],
      email: [requiredValidator, emailValidator],
      token: [requiredValidator, trimValidator],
    }),
    [requiredValidator, emailValidator, trimValidator],
  );
  const { validate, validateAll, formErrors } =
    useFormValidations(fieldValidators);

  const handleNameChange = (e) => {
    const { value: newName } = e.target;
    setFormState((formState) => ({
      ...formState,
      name: newName,
    }));
    isFormDirtyRef.current = true;
  };

  const handleClusterIdChange = (e) => {
    const { value: newName } = e.target;
    setFormState((formState) => ({
      ...formState,
      clusterId: newName,
    }));
    isFormDirtyRef.current = true;
  };

  const handleEmailChange = (e) => {
    const { value: newName } = e.target;
    setFormState((formState) => ({
      ...formState,
      email: newName,
    }));
    isFormDirtyRef.current = true;
  };

  const handleTokenChange = (e) => {
    const { value: newName } = e.target;
    setFormState((formState) => ({
      ...formState,
      token: newName,
    }));
    isFormDirtyRef.current = true;
  };

  const handleDelete = () => {
    const onPrev = () => {
      openModal({
        modalType: MODAL_TYPE.caEdit,
        modalData: {
          id: systemCADetail.id,
          user,
        },
      });
    };
    openModal({
      modalType: MODAL_TYPE.confirm,
      modalData: {
        title: "modal_edit_ca_confirm_deletion_title",
        content: "modal_edit_ca_confirm_deletion_content",
        confirmType: "warn",
        confirmButtonName: t("btn_delete"),
        handleGoBack: onPrev,
        handleConfirm: () => {
          deleteSystemCA({
            id: systemCADetail.id,
          });
        },
      },
    });
  };

  const handleCheckMember = () => {
    const onPrev = () => {
      openModal({
        modalType: MODAL_TYPE.caEdit,
        modalData: {
          id: systemCADetail.id,
          user,
        },
      });
    };
    openModal({
      modalType: MODAL_TYPE.systemCAMember,
      modalData: {
        id: systemCADetail.id,
        members: formState.members,
        onPrev,
      },
    });
  };

  // NOTE: Validate name field after value changed
  useEffect(() => {
    if (isFormDirtyRef.current && formState) {
      validate(formState, "clusterId");
      validate(formState, "email");
      validate(formState, "token");
      isFormDirtyRef.current = false;
    }
  }, [formState, validate]);

  // NOTE: Sync state with parent element
  useEffect(() => {
    setIsFormValid(
      Object.values(formErrors).every((errorMsg) => errorMsg === null),
    );
  }, [formErrors, setIsFormValid]);

  // NOTE: Updates formState.members to match systemCADetail.members when latter changes
  useEffect(() => {
    if (systemCADetail?.members) {
      setFormState((formState) => ({
        ...formState,
        members: systemCADetail.members,
      }));
    }
  }, [systemCADetail]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const isFormValid = validateAll(formState);
    setIsFormValid(isFormValid);
    if (isFormValid) {
      updateSystemCA({
        id: systemCADetail.id,
        name: formState.name,
        cluster_id: formState.clusterId,
        token: formState.token,
        email: formState.email,
        // NOTE: pem: formState.pem,
      });
    }
  };

  return (
    <Wrapper width="470px">
      <Close onClick={isLoading ? null : onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_ca_edit_title")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          <CAEditForm
            formErrors={formErrors}
            formState={formState}
            handleNameChange={handleNameChange}
            handleClusterIdChange={handleClusterIdChange}
            handleEmailChange={handleEmailChange}
            handleTokenChange={handleTokenChange}
            handleCheckMember={handleCheckMember}
            handleDelete={handleDelete}
          />
        </Content>
      </Body>
      <Panel>
        <ButtonWithLoading
          isLoading={isLoading}
          type="cancel"
          handleEvent={onModalClose}
        >
          {t("btn_cancel")}
        </ButtonWithLoading>
        <DividerBtn />
        <ButtonWithLoading
          isLoading={isLoading}
          type={isFormValid ? "primaryFlex" : "disabled"}
          handleEvent={isFormValid ? handleSubmit : () => {}}
        >
          {t("btn_confirm")}
        </ButtonWithLoading>
      </Panel>
    </Wrapper>
  );
};

export default CAEdit;
