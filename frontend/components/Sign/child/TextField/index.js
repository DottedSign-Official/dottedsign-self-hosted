import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { Wrapper, Input, Textarea, ErrorText, Error } from "./styled";
import Placeholder from "../../../Placeholder";
import { VALIDATION_TYPE } from "../../../../constants/constants";
import { creditCardFormatter } from "../../../../helpers/sign";
import { ALIGNMENT_TYPE } from "../../../../constants/constants";

const TextField = ({ isEdit, inputValue, options, setSignature, fontSize }) => {
  const { t } = useTranslation("common");

  const [errorMessage, setErrorMessage] = useState("");

  // NOTE: const [isFocus, setIsFocus] = useState(false);
  const [isIni, setIsIni] = useState(true);
  const [myValue, setMyValue] = useState("");

  useEffect(() => {
    if (inputValue) {
      let copy = inputValue;
      setMyValue(copy.replace(/&#x0A;/g, "\r\n"));
    }
  }, [inputValue]);

  const isTextarea = options && options.is_multi_line;
  const InputComponent = isTextarea ? Textarea : Input;

  const onInputChange = (e) => {
    const val = e.target.value;
    const formattedValue =
      options.validation === VALIDATION_TYPE.CREDIT_CARD
        ? creditCardFormatter(val)
        : val;

    setMyValue(formattedValue);
  };

  const onSetSignature = () => {
    if (isIni) {
      setIsIni(false);
    }

    let copy = myValue;

    const message = setSignature({
      category: "textfield",
      raw: copy.replace(/\r\n?/g, "&#x0A;"),
    });
    setErrorMessage(message);
  };

  const onMouseDown = () => {
    // NOTE: setIsFocus(true);
  };
  const onMouseUp = () => {
    // NOTE: setIsFocus(false);
    onSetSignature();
  };

  const onBlur = (e) => {
    e.target.scrollLeft = 0;
    e.target.scrollTop = 0;
  };

  return (
    <Wrapper isTextarea={isTextarea} onBlur={onBlur}>
      {isEdit ? (
        <>
          {(!myValue || (myValue && myValue.length < 1)) && (
            <Placeholder
              text={options?.placeholder || t("input_text")}
              fontSize={fontSize}
              alignment={options?.alignment}
              verticalAlignment={
                options?.is_multi_line
                  ? ALIGNMENT_TYPE.START
                  : ALIGNMENT_TYPE.CENTER
              }
              lineWrap={options?.is_multi_line}
            />
          )}
          <InputComponent
            value={myValue}
            placeholder={""}
            onChange={onInputChange}
            onMouseDown={onMouseDown}
            onBlur={onMouseUp}
            $fontSize={`${fontSize}px`}
            alignment={options?.alignment}
          />
          {errorMessage && (
            <Error>
              !
              <ErrorText>
                {t(errorMessage).replace("${length}", options.length)}
              </ErrorText>
            </Error>
          )}
        </>
      ) : (
        <>
          <InputComponent
            value={myValue && myValue.length > 0 ? myValue : ""}
            readOnly
            $fontSize={`${fontSize}px`}
            alignment={options?.alignment}
            verticalAlignment={
              options?.is_multi_line
                ? ALIGNMENT_TYPE.START
                : ALIGNMENT_TYPE.CENTER
            }
          />
        </>
      )}
    </Wrapper>
  );
};

export default TextField;
