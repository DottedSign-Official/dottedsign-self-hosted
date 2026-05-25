import React from "react";
import { useTranslation } from "next-i18next";
import { Wrapper, SignatureBlock } from "./styled";
import { typeToBase64Type } from "../../../../../helpers/base64";
import Placeholder from "../../../../Placeholder";

const SignInput = ({ signature, isEdit, fontSize }) => {
  const { t } = useTranslation("common");

  return (
    <Wrapper>
      {signature &&
      signature.raw &&
      signature.raw !== undefined &&
      signature.raw.length > 0 ? (
        <SignatureBlock
          src={`data:image/${typeToBase64Type(signature.file_type)};base64,${
            signature.raw
          }`}
          alt={"signature"}
        />
      ) : (
        <>
          {isEdit && (
            <Placeholder text={t("input_signature")} maxWidth={fontSize} />
          )}
        </>
      )}
    </Wrapper>
  );
};

export default SignInput;
