import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as signActions from "../../redux/actions/sign";
import Portal from "../../components/Portal";
import SignBoard from "../../containers/SignBoard";
import SignBoardStamp from "../../components/SignBoardStamp";
import { useLicenseHook } from "../../helpers/license";
import { LICENSE_TYPE } from "../../constants/licenseTypes";
import modes from "./data";

const Panel = ({ onPanelClose, setSignature }) => {
  const [currentMode, setCurrentMode] = useState(modes[0]);
  const { isLoading, guestSignature } = useSelector((state) => state.sign);
  const dispatch = useDispatch();
  const saveSignGuest = (data) => dispatch(signActions.saveSignGuest(data));
  const license = useLicenseHook(LICENSE_TYPE.SIGN_VIDEO);

  useEffect(() => {
    if (guestSignature) {
      setSignature(guestSignature);
      onPanelClose();
    }

    return () => {
      dispatch(signActions.clearSignGuest());
    };
  }, [guestSignature, dispatch, onPanelClose, setSignature]);

  const onModeChange = (mode) => {
    setCurrentMode(mode);
  };

  const onConfirm = (sign, fileType, category) => {
    saveSignGuest({
      file_type: fileType || "png",
      category: category || "signature",
      raw: {
        raw: sign.raw,
        base64_images: sign.base64_images,
      },
      sign_stroke: sign.sign_stroke,
      license,
    });
  };

  return (
    <Portal>
      {currentMode.key === "signature" ? (
        <SignBoard
          id="quest-sign-board"
          onClose={onPanelClose}
          onSignSave={onConfirm}
          modes={modes}
          currentMode={currentMode}
          onModeChange={onModeChange}
        />
      ) : (
        <SignBoardStamp
          isLoading={isLoading}
          idUpload="Tasks-upload_stamp-QuickSign"
          idSave="Tasks-Save_stamp-QuickSign"
          onClose={onPanelClose}
          onSignSave={onConfirm}
          modes={modes}
          currentMode={currentMode}
          onModeChange={onModeChange}
        />
      )}
    </Portal>
  );
};

export default Panel;
