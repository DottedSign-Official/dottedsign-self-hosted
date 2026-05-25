import React from "react";
import Signature from "../child/Signature";
import CheckBox from "../child/Checkbox";
import TextField from "../child/TextField";
import TextDateField from "../child/TextDateField";
import Image from "../child/Image";
import Link from "../child/Link";

const Edit = ({
  id,
  type,
  fileType,
  raw,
  isDate,
  idDate,
  style,
  options,
  setSignature,
  fontSize,
}) => {
  if (type === "signature") {
    return (
      <Signature
        signId={id}
        fontSize={fontSize}
        signed={{ file_type: fileType, raw }}
        options={options}
        setSignature={setSignature}
        isEdit
      />
    );
  }
  if (type === "textfield" && !isDate) {
    return (
      <TextField
        fontSize={fontSize}
        inputValue={raw}
        options={options}
        setSignature={setSignature}
        isEdit
      />
    );
  }
  if (type === "textfield" && isDate) {
    return (
      <TextDateField
        id={idDate}
        fontSize={fontSize}
        inputValue={raw}
        options={options}
        setSignature={setSignature}
        isEdit
      />
    );
  }

  if (type === "checkbox") {
    return (
      <CheckBox
        isChecked={raw}
        style={style}
        options={options}
        setSignature={setSignature}
        isEdit
      />
    );
  }

  if (type === "image") {
    return (
      <Image
        alt={""}
        signId={id}
        signed={{ file_type: fileType, raw }}
        setSignature={setSignature}
        options={options}
        isEdit
      />
    );
  }

  if (type === "link") {
    return (
      <Link
        inputValue={raw}
        options={options}
        setSignature={setSignature}
        isEdit
      />
    );
  }

  return null;
};

export default Edit;
