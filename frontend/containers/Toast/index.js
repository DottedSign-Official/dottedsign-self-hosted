import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { closeToast } from "../../redux/actions/common";
import ToastComponent from "../../components/Toast";

const ToastContainer = () => {
  const timerRef = useRef();
  const hideRef = useRef();
  const deleRef = useRef();
  const [isHide, setIsHide] = useState(true);
  const [isRender, setIsRender] = useState(false);
  const [lastType, setLastType] = useState(null);

  const isToast = useSelector((state) => state.common.isToast);
  const toastId = useSelector((state) => state.common.toastId);
  const toastType = useSelector((state) => state.common.toastType);
  const toastData = useSelector((state) => state.common.toastData);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isToast) {
      setIsRender(true);

      hideRef.current = setTimeout(() => {
        setIsHide(false);
      }, 300);

      deleRef.current = setTimeout(() => {
        dispatch(closeToast());
      }, 5000);

      return () => {
        clearTimeout(hideRef.current);
        clearTimeout(deleRef.current);
      };
    } else {
      setIsHide(true);

      if (isRender) {
        clearTimeout(hideRef.current);
        clearTimeout(deleRef.current);
        clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
          setIsRender(false);
          setLastType(null);
        }, 800);

        return () => {
          clearTimeout(timerRef.current);
        };
      }
    }
  }, [isToast, isRender, dispatch]);

  useEffect(() => {
    if (toastType) {
      setLastType(toastType);
    }
  }, [toastType]);

  useEffect(() => {
    return () => {
      clearTimeout(hideRef.current);
      clearTimeout(deleRef.current);
      clearTimeout(timerRef.current);
    };
  }, []);

  const onCloseToast = () => {
    dispatch(closeToast());
  };

  if (!isRender) {
    return null;
  }

  return (
    <ToastComponent
      id={toastId}
      isHide={isHide}
      toastType={lastType}
      toastData={toastData}
      onCloseToast={onCloseToast}
    />
  );
};

export default ToastContainer;
