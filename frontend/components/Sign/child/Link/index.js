import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";
import { openModal as openModalAction } from "../../../../redux/actions/common";
import { textEncode, textDecode } from "../../../../helpers/parser";
import {
  PDF_VIEWPORT_SCALE_MOBILE,
  PDF_VIEWPORT_SCALE,
  MODAL_TYPE,
} from "../../../../constants/constants";
import regex from "../../../../constants/regex";
import { Placeholder } from "../styled";
import { Wrapper, Error, ErrorText } from "../TextField/styled";
import { Input } from "./styled";

const LinkField = ({ isEdit, inputValue, options, setSignature }) => {
  const { t } = useTranslation("common");
  const [isIni, setIsIni] = useState(true);
  const [myValue, setMyValue] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorType, setErrorType] = useState(null); // NOTE: null | 'length' | 'validate'

  const { isMobile } = useSelector((state) => state.common);
  const dispatch = useDispatch();
  const openModal = (data) => dispatch(openModalAction(data));

  const validateInput = useCallback(
    (value) => {
      setIsError(false);
      setErrorType(null);

      if (options?.length && value.length > options.length) {
        setIsError(true);
        setErrorType("length");
        return false;
      }

      const tester = new RegExp(regex.link);
      const isValid = tester.test(value);

      if (!isValid) {
        setIsError(true);
        setErrorType("validate");
        return false;
      }

      return true;
    },
    [options],
  );

  useEffect(() => {
    if (!isIni) {
      return;
    }

    if (!inputValue) {
      setMyValue("");
      return;
    }

    const decodedValue = textDecode(inputValue);
    setMyValue(decodedValue);
    setIsIni(false);

    if (isEdit) {
      const isInputValid = validateInput(decodedValue);
      if (!isInputValid) {
        setSignature({
          category: "link",
          raw: null,
        });
      }
    }
  }, [isIni, inputValue, isEdit, setSignature, validateInput]);

  const InputComponent = Input;

  const onInputChange = (e) => {
    const val = e.target.value;

    // NOTE: avoid string empty, such as space, tab...
    if (val.trim().length === 0) {
      return setMyValue("");
    }
    setMyValue(val);
  };

  const onSetSignature = () => {
    if (isIni) {
      setIsIni(false);
    }

    const isInputValid = validateInput(myValue);
    if (isInputValid) {
      let copy = myValue;
      setSignature({
        category: "link",
        raw: textEncode(copy) || "",
      });
    } else {
      setSignature({
        category: "link",
        raw: null,
      });
    }
  };

  const onMouseUp = () => {
    onSetSignature();
  };

  const onLinkClick = () => {
    const temp = myValue && myValue.length > 0 ? myValue : "";
    const tester = new RegExp(regex.link);
    const isValid = tester.test(temp);

    if (!isValid) {
      return;
    }

    openModal({
      modalType: MODAL_TYPE.openLink,
      modalData: { link: temp },
    });
  };

  const scale = isMobile ? PDF_VIEWPORT_SCALE_MOBILE : PDF_VIEWPORT_SCALE;

  const fontSize = `${(options?.font_size || 14) * scale}px`;
  const placeholder = options?.placeholder || t("input_link", { ns: "create" });
  const isForce = options?.force;

  const errorContent = (() => {
    if (errorType === "length") {
      return t("textfield_error_length").replace("${length}", options.length);
    }

    if ((isForce || myValue) && errorType === "validate") {
      return "link_error_validate";
    }
    return null;
  })();

  return (
    <Wrapper>
      {isEdit ? (
        <>
          {(!myValue || (myValue && myValue.length < 1)) && (
            <Placeholder fontSize={fontSize}>{placeholder}</Placeholder>
          )}
          <InputComponent
            value={myValue}
            placeholder={""}
            onChange={onInputChange}
            onBlur={onMouseUp}
            fontSize={fontSize}
          />
          {isError && errorType && errorContent && (
            <Error>
              !<ErrorText>{t(errorContent)}</ErrorText>
            </Error>
          )}
        </>
      ) : (
        <InputComponent
          value={myValue && myValue.length > 0 ? myValue : ""}
          fontSize={fontSize}
          readOnly
          onClick={onLinkClick}
          isLink
        />
      )}
    </Wrapper>
  );
};

export default LinkField;
