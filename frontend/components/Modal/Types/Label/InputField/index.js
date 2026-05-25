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
    callbackValue(e.target.value);
  };

  return (
    <Field>
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
