import React, { useState, useEffect, useRef } from "react";
import onBlur from "../../../helpers/onBlur";
import { Input } from "../../../global/styledForm";

const EnvelopeNameInput = ({ value, onSubmit, isBlankProhibit }) => {
  const blurRef = useRef();
  const [inputVal, setInputVal] = useState("");

  useEffect(() => {
    return () => {
      return () => (blurRef.current = null);
    };
  }, []);

  useEffect(() => {
    if (value) {
      setInputVal(value);
    }
  }, [value]);

  const onChangeEvent = (e) => {
    const val = e.target.value;
    setInputVal(val);
  };

  const onBlurEvent = (e) => {
    blurRef.current = null;

    onBlur(blurRef, () => {
      onUpdate();
    })(e);
  };

  const onUpdate = () => {
    if (isBlankProhibit && inputVal.length < 1) {
      setInputVal(value);
    } else {
      onSubmit(inputVal);
    }
  };

  return (
    <Input
      tabIndex="56"
      value={inputVal}
      onChange={onChangeEvent}
      onBlur={onBlurEvent}
      borderColor={"rgba(0, 0, 0, 0.2)"}
    />
  );
};

export default EnvelopeNameInput;
