import React from "react";
import { useTranslation } from "next-i18next";

import Button from "../Button";
import Icon from "../Icon";
import { Form, Input } from "../../global/styledForm";
import { WrapperItems, Item, ItemDelete, InputWrapper } from "./styled";

const SystemCAMemberForm = React.forwardRef(
  (
    {
      email,
      emailList,
      isInputValid,
      handleRemoveMail,
      handleSubmit,
      handleChangeMemberMail,
      handleAddMail,
    },
    formRef,
  ) => {
    const { t } = useTranslation("modal");

    const deleteIcon = (mail) => {
      if (emailList.length > 1) {
        return (
          <ItemDelete onClick={() => handleRemoveMail(mail)}>
            <Icon type="cancelBlack" size="12px" />
          </ItemDelete>
        );
      }
      return null;
    };

    return (
      <Form ref={formRef} onSubmit={handleSubmit}>
        <WrapperItems>
          <InputWrapper>
            <Input
              onChange={handleChangeMemberMail}
              value={email || ""}
              placeholder={t("modal_system_ca_member_placeholder")}
              onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
            />
          </InputWrapper>
          <Button
            type={isInputValid ? "primaryFlex" : "disabled"}
            handleEvent={isInputValid ? handleAddMail : () => {}}
          >
            {t("modal_system_ca_member_add_btn")}
          </Button>
        </WrapperItems>

        <WrapperItems>
          {emailList.map((mail, idx) => (
            <Item key={idx}>
              {mail}
              {deleteIcon(mail)}
            </Item>
          ))}
        </WrapperItems>
      </Form>
    );
  },
);
SystemCAMemberForm.displayName = "SystemCAMemberForm";

export default SystemCAMemberForm;
