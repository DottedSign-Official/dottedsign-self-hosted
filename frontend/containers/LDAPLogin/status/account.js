import React, { useState } from "react";
import { useSelector } from "react-redux";

import InputField from "../../../components/InputField";
import ButtonWithLoading from "../../../components/ButtonWithLoading";
import Button from "../../../components/Button";
import { Wrapper, Inner, Content, Title, Logo } from "../styled";
import { useRouter } from "next/router";
import Separator from "../separator";
import {
  useCommonValidators,
  useFormValidations,
} from "../../../helpers/customHooks";

const Account = ({ checkEmail, onKeyDown, t }) => {
  const router = useRouter();

  const [formState, setFormState] = useState({
    email: "",
  });
  const [isFormValid, setIsFormValid] = useState(true);

  const { isLoading } = useSelector((state) => state.login);

  const { emailValidator } = useCommonValidators();
  const fieldValidators = React.useMemo(
    () => ({
      email: [emailValidator],
    }),
    [emailValidator],
  );
  const { validateAll, formErrors } = useFormValidations(fieldValidators);

  const handleEmailChanged = (value) => {
    const newState = {
      ...formState,
      email: value,
    };
    setFormState(newState);
    setIsFormValid(validateAll(newState));
  };

  const handleEmail = () => {
    const isValid = validateAll(formState);
    setIsFormValid(isValid);
    if (isValid) {
      checkEmail(formState.email);
    }
  };

  return (
    <Wrapper>
      <Inner>
        <Content>
          <Title>{t("ldap_login_title")}</Title>
          <Logo />
          <InputField
            type="text"
            placeholder={t("login_placeholder")}
            content={""}
            errorHint={formErrors.email}
            onKeyDown={(e) => onKeyDown(e, () => handleEmail())}
            callback={() => {}}
            callbackValue={handleEmailChanged}
          />
        </Content>

        <ButtonWithLoading
          isLoading={isLoading}
          type={isFormValid ? "primary" : "disabled"}
          handleEvent={isFormValid ? handleEmail : null}
        >
          {<p>{t("continue")}</p>}
        </ButtonWithLoading>

        <Separator text={t("or")} />

        <Button type="primary" handleEvent={() => router.push("/")}>
          <p>{t("general_login")}</p>
        </Button>
      </Inner>
    </Wrapper>
  );
};

export default Account;
