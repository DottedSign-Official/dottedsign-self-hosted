import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setAssignes } from "../../redux/actions/create";
import { openModal } from "../../redux/actions/common";
import AssignesFix from "../../components/ListFixSigners";
import { MODAL_TYPE } from "../../constants/constants";

// NOTE: assignes: { role, informable, custom_setting: { role, informable } }
// NOTE: custom_setting used in ListFixSigners
const PanelFd = () => {
  const { isOrder, assignes } = useSelector((state) => state.create);
  const dispatch = useDispatch();

  const onRoleNameChange = (itm) => (val) => {
    const list = assignes.map((ass) => {
      if (ass.uid === itm.uid) {
        return {
          ...ass,
          name: val,
        };
      }
      return ass;
    });
    dispatch(setAssignes({ assignes: list }));
  };

  const onMore = (itm) => {
    const onConfirm = (itmUpdated) => {
      const newSigners = assignes.map((ass) => {
        if (ass.key === itmUpdated.key && ass.uid === itmUpdated.uid) {
          return {
            ...ass,
            custom_setting: itmUpdated.custom_setting,
            informable: itmUpdated.custom_setting.informable,
          };
        }

        return ass;
      });
      dispatch(setAssignes({ assignes: newSigners }));
    };

    return dispatch(
      openModal({
        modalType: MODAL_TYPE.signerSettingsFd,
        modalData: { signer: itm, onConfirm },
      }),
    );
  };

  return (
    <AssignesFix
      list={assignes}
      isOrder={isOrder}
      onNameChange={onRoleNameChange}
      onMore={onMore}
      isMore
    />
  );
};

export default PanelFd;
