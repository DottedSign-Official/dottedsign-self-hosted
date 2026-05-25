import React, { useRef, useState, useEffect } from "react";
import onBlur from "../../helpers/onBlur";
import { Input } from "../../global/styledForm";

const InputContainer = ({
  refInput,
  value,
  onSubmit,
  isReadOnly,
  placeholder = "Name",
}) => {
  const blurRef = useRef();
  const [copy, setCopy] = useState("");

  useEffect(() => {
    const blur = blurRef;
    return () => clearTimeout(blur.current);
  }, []);

  useEffect(() => {
    setCopy(value);
  }, [value]);

  const onChange = (e) => {
    setCopy(e.target.value);
  };

  const onBlurEvent = (e) => {
    clearTimeout(blurRef.current);
    onBlur(blurRef, () => {
      if (!onSubmit) {
        return;
      }
      onSubmit(copy, setCopy);
    })(e);
  };

  return (
    <div
      tabIndex="56"
      onBlur={onBlurEvent}
      style={{ width: "100%", display: "flex" }}
    >
      <Input
        ref={refInput}
        value={copy}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={isReadOnly}
      />
    </div>
  );
};

export default InputContainer;
