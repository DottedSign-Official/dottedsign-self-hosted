import React, { useState, useEffect } from "react";
import { Textarea } from "../../global/styledForm";
import { Wrapper, Counter } from "./styled";

const TextareaComp = ({
  value,
  onSubmit,
  placeholder,
  rows = 5,
  limit = 500,
  isReadOnly,
  isHideCounter,
  postProcessor = (value) => value,
}) => {
  const [val, setVal] = useState(value || "");

  const onChange = (e) => {
    setVal(postProcessor(e.target.value));
  };

  const onBlur = () => {
    onSubmit(val);
  };

  useEffect(() => {
    setVal(value);
  }, [value]);

  return (
    <Wrapper>
      <Textarea
        tabIndex="5566"
        value={val}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        rows={rows}
        readOnly={isReadOnly}
        maxLength={limit}
      />
      {!isHideCounter && !isReadOnly && (
        <Counter>{`${value?.length || 0} / ${limit}`}</Counter>
      )}
    </Wrapper>
  );
};

export default TextareaComp;
