import React, { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import { openModal } from "../../redux/actions/common";
import { MODAL_TYPE } from "../../constants/constants";
import {
  getOrganization,
  getDeclineReasons,
  setDeclineReason as setDeclineReasonAction,
  deleteDeclineReason as deleteDeclineReasonAction,
} from "../../redux/actions/admin";
import DeclineReasonList from "../../components/DeclineReasonList";

const DeclineReasonListContainer = () => {
  const router = useRouter();
  const currentPath = router.pathname;
  const declineReasons = useSelector(
    (state) => state.admin.declineReasons || [],
  );
  const org = useSelector((state) => state.admin.organization);
  const dispatch = useDispatch();
  const deleteDeclineReason = (data) =>
    dispatch(deleteDeclineReasonAction(data));
  const setDeclineReason = useCallback(
    (data) => dispatch(setDeclineReasonAction({ groupId: org?.id, ...data })),
    [dispatch, org],
  );
  const { t } = useTranslation(["modal"]);

  const handleAddDeclineReason = () => {
    dispatch(
      openModal({
        modalType: MODAL_TYPE.declineReason,
        modalData: {
          onSubmit: setDeclineReason,
          declineReason: {
            content: "",
            currentPath,
          },
        },
      }),
    );
  };

  const handleEditDeclineReason = (declineReason) => {
    dispatch(
      openModal({
        modalType: MODAL_TYPE.declineReason,
        modalData: {
          onSubmit: setDeclineReason,
          declineReason: { ...declineReason, currentPath },
        },
      }),
    );
  };

  const handleRemoveDeclineReason = (declineReason) => {
    const { id } = declineReason;
    dispatch(
      openModal({
        modalType: MODAL_TYPE.confirm,
        modalData: {
          confirmType: "warn",
          confirmButtonName: t("btn_delete"),
          title: "modal_decline_reason_confirm_deletion_title",
          content: "modal_decline_reason_confirm_deletion_content",
          handleConfirm: () => {
            deleteDeclineReason({ groupId: org?.id, id, currentPath });
          },
        },
      }),
    );
  };

  useEffect(() => {
    if (!org) {
      dispatch(getOrganization());
    }
    dispatch(getDeclineReasons({ currentPath }));
  }, [org, currentPath, dispatch]);

  return (
    <DeclineReasonList
      declineReasons={declineReasons}
      handleAddDeclineReason={handleAddDeclineReason}
      handleEditDeclineReason={handleEditDeclineReason}
      handleRemoveDeclineReason={handleRemoveDeclineReason}
    />
  );
};

export default DeclineReasonListContainer;
