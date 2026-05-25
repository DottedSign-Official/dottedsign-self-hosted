import MobileDetect from "mobile-detect";
import { useDispatch } from "react-redux";
import { openToast } from "../../redux/actions/common";

// NOTE: ios15 cant open a big image, but it work fine when using multiple mode of <input> element
const useIOS = (isMulti) => {
  const dispatch = useDispatch();
  const os = new MobileDetect(window.navigator.userAgent).os();

  const isMultiWrapper = () => {
    return os === "iOS" || isMulti;
  };

  const onDropEventWrapper = (onDropEvent) => {
    return (isContinuousUpload, files, acceptedFiles) => {
      if (isMultiWrapper() && !isMulti && acceptedFiles.length > 1) {
        return dispatch(
          openToast({
            data: { isWarning: true, text: "file_overCount" },
          }),
        );
      }
      onDropEvent(isContinuousUpload, files, acceptedFiles);
    };
  };

  return { isMultiWrapper, onDropEventWrapper };
};

export default useIOS;
