import { SIGNATURE_CATEGORY } from "../../constants/constants";
import React from "react";
import { useTranslation } from "next-i18next";
import Loader from "../Loaders/Sign";
import SignItem from "./SignItem";
import { Wrapper } from "./styled";

const defaultSignature = {
  category: SIGNATURE_CATEGORY.SIGNATURE,
  file_type: "png",
  raw: null,
};

const defaultInitial = {
  category: SIGNATURE_CATEGORY.INITIAL,
  file_type: "png",
  raw: null,
};

const Mysign = ({
  isLoading,
  activeItem,
  mySigns,
  onSignDelete,
  onSignSelect,
  onSignBlur,
}) => {
  const { t } = useTranslation("settings");

  let signSignature, signInitial;

  if (!mySigns || isLoading) {
    return (
      <Wrapper>
        <Loader />
        <Loader />
      </Wrapper>
    );
  }

  const signSignatures = mySigns.filter(
    (sign) => sign.category === SIGNATURE_CATEGORY.SIGNATURE,
  );
  const signInitials = mySigns.filter(
    (sign) => sign.category === SIGNATURE_CATEGORY.INITIAL,
  );

  signSignature =
    signSignatures.length > 0 ? signSignatures[0] : defaultSignature;
  signInitial = signInitials.length > 0 ? signInitials[0] : defaultInitial;

  return (
    <Wrapper tabIndex="5566" onBlur={onSignBlur}>
      <SignItem
        isActive={activeItem === signSignature}
        sign={signSignature}
        onSignDelete={onSignDelete}
        onSignSelect={onSignSelect}
      >
        {t("blank_signature")}
      </SignItem>

      <SignItem
        isActive={activeItem === signInitial}
        sign={signInitial}
        onSignDelete={onSignDelete}
        onSignSelect={onSignSelect}
      >
        {t("blank_initial")}
      </SignItem>
    </Wrapper>
  );
};

export default Mysign;
