import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { openModal as openModalAction } from "../../redux/actions/common";
import { MODAL_TYPE } from "../../constants/constants";
import EditAssignes from "../../components/EditAssignes";

const EditAssignesContainer = ({ isViewOnly }) => {
  const { isTemplate, isOrder, assignes } = useSelector(
    (state) => state.create,
  );
  const dispatch = useDispatch();
  const openModal = (data) => dispatch(openModalAction(data));

  const onEdit = () => {
    const payload = {
      modalType: MODAL_TYPE.manageSigners,
      modalData: null,
    };
    openModal(payload);
  };

  return (
    <EditAssignes
      isViewOnly={isViewOnly}
      isTemplate={isTemplate}
      isOrder={isOrder}
      assignes={assignes}
      onEdit={onEdit}
    />
  );
};

export default EditAssignesContainer;
