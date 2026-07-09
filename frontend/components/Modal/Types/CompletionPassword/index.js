import { useState } from "react";
import { useTranslation } from "next-i18next";
import { useDispatch } from "react-redux";
import { openToast } from "../../../../redux/actions/common";
import { OPEN_TOAST } from "../../../../constants/commonTypes";
import toastStatus from "../../../../constants/toast";
import Icon from "../../../Icon";
import Button from "../../../Button";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Hint,
} from "../../../../global/styledModal";
import {
  Content,
  InputWrapper,
  PasswordField,
  PasswordInput,
  VisibilityButton,
} from "./styled";

const CompletionPassword = ({ onModalClose, data: { completionPassword } }) => {
  const { t } = useTranslation("modal");
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(completionPassword);
      dispatch(
        openToast({
          type: OPEN_TOAST,
          data: {
            text: "copy_suc",
            isWarning: false,
          },
        }),
      );
    } catch (e) {
      console.error(e);
      dispatch(
        openToast({
          type: OPEN_TOAST,
          payload: toastStatus.commonError,
        }),
      );
    }
  };

  return (
    <Wrapper width="470px">
      <Close onClick={onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_completion_password")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          <Hint>{t("desc_completion_password")}</Hint>
          <InputWrapper>
            <PasswordField>
              <PasswordInput
                value={completionPassword}
                type={showPassword ? "text" : "password"}
                $isVisible={showPassword}
                readOnly
              />
              <VisibilityButton
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <Icon type={showPassword ? "eyeOff" : "eye"} size="24px" />
              </VisibilityButton>
            </PasswordField>
            <Button type="cancel" handleEvent={onCopy}>
              {t("btn_copy")}
            </Button>
          </InputWrapper>
        </Content>
      </Body>
    </Wrapper>
  );
};

export default CompletionPassword;
