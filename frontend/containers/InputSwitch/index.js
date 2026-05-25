import React, { useRef, useState, useEffect } from "react";
import onBlur from "../../helpers/onBlur";
import InputSwitch from "../../components/InputSwitch";

const InputSwitchContainer = ({
  isBlankProhibit,
  value,
  onSubmit,
  isEnvelopeAssign,
  fileList,
  setFileList,
  fileFocus,
  setFileFocus,
}) => {
  const blurRef = useRef();
  const [inputVal, setInputVal] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  const onEditEvent = () => {
    if (!isEdit) {
      setIsEdit(true);
    }
  };

  const onChangeEvent = (e) => {
    const val = e.target.value;
    setInputVal(val);
  };

  const onUpdate = () => {
    if (isBlankProhibit && inputVal.length < 1) {
      setInputVal(value);
    } else if (isEnvelopeAssign) {
      const newFileList = fileList.map((f) =>
        f.fileId === fileFocus.fileId ? { ...f, fileName: inputVal } : f,
      );
      setFileFocus({ ...fileFocus, fileName: inputVal });
      setFileList(newFileList);
    } else {
      onSubmit(inputVal);
    }

    setIsEdit(false);
  };

  const onKeyEvent = (e) => {
    if (e.keyCode === 13) {
      onUpdate();
    }
  };

  const onBlurEvent = (e) => {
    clearTimeout(blurRef.current);
    onBlur(blurRef, () => {
      if (isEdit) {
        onUpdate();
      }
    })(e);
  };

  useEffect(() => {
    const blur = blurRef;
    return () => clearTimeout(blur.current);
  }, []);

  useEffect(() => {
    if (value) {
      setInputVal(value);
    }
  }, [value]);

  return (
    <InputSwitch
      isEdit={isEdit}
      inputVal={inputVal}
      onEditEvent={onEditEvent}
      onChangeEvent={onChangeEvent}
      onKeyEvent={onKeyEvent}
      onBlurEvent={onBlurEvent}
    />
  );
};

export default InputSwitchContainer;
