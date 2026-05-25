import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AssignCAAdminComp from "../../components/AssignCAAdmin";
import { MODAL_TYPE } from "../../constants/constants";
import { openModal as openModalAction } from "../../redux/actions/common";
import { getSystemCAList } from "../../redux/actions/admin";

const AssignCAAdmin = () => {
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.admin);
  const { systemCAList } = useSelector((state) => state.admin);

  const dispatch = useDispatch();
  const openModal = (data) => dispatch(openModalAction(data));

  useEffect(() => {
    if (systemCAList === null) {
      dispatch(getSystemCAList());
    }
  }, [systemCAList, dispatch]);

  const handleCreateCA = () => {
    openModal({
      modalType: MODAL_TYPE.caCreate,
    });
  };

  const onMoreAction = (id) => {
    openModal({
      modalType: MODAL_TYPE.caEdit,
      modalData: {
        user,
        id,
      },
    });
  };

  return (
    <AssignCAAdminComp
      handleCreateCA={handleCreateCA}
      onMoreAction={onMoreAction}
      isPlaceholder={isLoading}
      systemCAList={systemCAList}
    />
  );
};

export default AssignCAAdmin;
