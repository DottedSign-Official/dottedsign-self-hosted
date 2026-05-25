import React, { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  closeModal as closeModalAction,
  submitModal as submitModalAction,
} from "../../redux/actions/common";
import Modal from "../../components/Modal";

const ModalContainer = () => {
  const modalType = useSelector((state) => state.common.modalType);
  const modalData = useSelector((state) => state.common.modalData);

  const dispatch = useDispatch();
  const closeModal = useCallback(
    () => dispatch(closeModalAction()),
    [dispatch],
  );
  const submitModal = (data) => dispatch(submitModalAction(data));

  useEffect(() => {
    return () => {
      closeModal();
    };
  }, [closeModal]);

  if (!modalType) {
    return null;
  }

  return (
    <Modal
      modalType={modalType}
      data={modalData}
      onModalClose={closeModal}
      onModalSubmit={submitModal}
    />
  );
};

export default ModalContainer;
