import { Input as GlobalStyleInput } from "../../../global/styledForm";
import { useState } from "react";
import { forwardRef } from "react";

const Input = ({ callback, value, placeholder, onEnter }, ref) => {
  const [text, setText] = useState(value);
  const handleBlur = () => {
    callback(text);
  };
  const onChange = (e) => {
    setText(e.target.value);
  };
  const onKeyUp = (e) => {
    if (e.key === "Enter") {
      onEnter();
    }
  };
  return (
    <GlobalStyleInput
      ref={ref}
      type="text"
      onChange={onChange}
      onKeyUp={onKeyUp}
      value={text}
      onBlur={handleBlur}
      placeholder={placeholder}
    />
  );
};
export default forwardRef(Input);
