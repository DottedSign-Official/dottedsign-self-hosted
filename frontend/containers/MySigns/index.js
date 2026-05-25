import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as commonActions from "../../redux/actions/common";
import * as signActions from "../../redux/actions/sign";
import { MODAL_TYPE } from "../../constants/constants";
import { LICENSE_TYPE } from "../../constants/licenseTypes";
import Portal from "../../components/Portal";
import MySign from "../../components/MySign";
import SignBoard from "../../containers/SignBoard";
import onBlur from "../../helpers/onBlur";
import { useLicenseHook } from "../../helpers/license";

const MySignsContainer = ({ onSelect }) => {
  const blurRef = useRef();
  const [creatingItem, setCreatingItem] = useState(null);
  const [isSignBoard, setIsSignBoard] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  const isLoading = useSelector((state) => state.sign.isLoading);
  const mySigns = useSelector((state) => state.sign.signs);
  const dispatch = useDispatch();
  const openModal = (data) => dispatch(commonActions.openModal(data));
  const saveSign = (data) => dispatch(signActions.saveSign(data));
  const deleSign = (data) => dispatch(signActions.deleteSign(data));

  const license = useLicenseHook(LICENSE_TYPE.SIGN_VIDEO);

  useEffect(() => {
    if (!mySigns) {
      dispatch(signActions.getSigns({ category: "signature" }));
    }
    const blur = blurRef;
    return () => clearTimeout(blur.current);
  }, [mySigns, dispatch]);

  const onSignSelect = (item) => {
    if (item.raw) {
      setActiveItem(item);

      if (onSelect) {
        onSelect(item);
      }
    } else {
      setIsSignBoard(true);
      setCreatingItem(item);
    }
  };

  const onSignBlur = (e) => {
    clearTimeout(blurRef.current);
    onBlur(blurRef, () => setActiveItem(null))(e);
  };

  const onSignDelete = (id) => {
    openModal({
      modalType: MODAL_TYPE.signDeleteConfirm,
      modalData: { onConfirm: () => deleSign({ id }) },
    });
  };

  const onSignSave = (data) => {
    setIsSignBoard(false);
    saveSign({
      ...creatingItem,
      ...data,
      license,
    });
  };

  const onBoardClose = () => {
    setIsSignBoard(false);
  };

  return (
    <>
      <MySign
        isLoading={isLoading}
        activeItem={activeItem}
        mySigns={mySigns}
        onSignDelete={onSignDelete}
        onSignSelect={onSignSelect}
        onSignBlur={onSignBlur}
      />
      {isSignBoard && (
        <Portal>
          <SignBoard
            onClose={onBoardClose}
            onSignSave={onSignSave}
            category={creatingItem.category}
          />
        </Portal>
      )}
    </>
  );
};

export default MySignsContainer;
