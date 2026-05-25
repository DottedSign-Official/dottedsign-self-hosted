import React from "react";
import Signature from "../child/Signature";
import CheckBox from "../child/Checkbox";
import TextField from "../child/TextField";
import TextDateField from "../child/TextDateField";
import Image from "../child/Image";
import Link from "../child/Link";
import { hexToBase64 } from "../../../helpers/base64";

const Fix = ({
  id,
  scaler,
  type,
  img,
  raw,
  isDate,
  value,
  style,
  options,
  fontSize,
}) => {
  if (type === "signature") {
    return (
      <Signature
        fontSize={fontSize}
        signed={{
          file_type: "png",
          raw: raw ? raw : hexToBase64(img),
        }}
        options={options}
      />
    );
  }

  if (type === "textfield" && !isDate) {
    return (
      <TextField
        fontSize={fontSize}
        scaler={scaler}
        inputValue={value || raw}
        options={options}
      />
    );
  }

  if ((type === "textfield" && isDate) || type === "systemtime") {
    return (
      <TextDateField
        fontSize={fontSize}
        scaler={scaler}
        inputValue={value}
        options={options}
      />
    );
  }

  if (type === "checkbox") {
    return (
      <CheckBox
        fontSize={fontSize}
        isChecked={value === "Yes" || raw}
        style={style}
        options={options}
      />
    );
  }
  if (type === "image") {
    return (
      <Image
        alt={""}
        signed={{
          file_type: "png",
          raw: raw || img,
        }}
        signId={id}
        options={options}
      />
    );
  }

  if (type === "link") {
    return <Link inputValue={value || raw} options={options} />;
  }

  return null;
};

export default Fix;
