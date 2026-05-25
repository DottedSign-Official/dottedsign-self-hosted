import React, { useState } from "react";

import { Field, Input, Hint } from "./styled";

const InputField = ({
  defaultValue,
  placeholder,
  content,
  errorHint,
  onKeyDown,
  callback,
  callbackValue,
}) => {
  const [value, setValue] = useState(defaultValue);
  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const onBlur = () => {
    callbackValue(value);
  };

  return (
    <Field onBlur={onBlur}>
      <Input
        type={"text"}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={onKeyDown}
      />
      {content && (
        <Hint onClick={callback} isActive={!!callback}>
          {content}
        </Hint>
      )}
      {errorHint && <Hint isError>{errorHint}</Hint>}
    </Field>
  );
};

export default InputField;
