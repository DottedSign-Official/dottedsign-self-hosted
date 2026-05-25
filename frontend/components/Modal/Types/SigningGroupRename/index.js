import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { putSigningGroup as putSigningGroupAction } from "../../../../redux/actions/settings";
import { useTranslation } from "react-i18next";
import Icon from "../../../Icon";
import Button from "../../../Button";
import { Input } from "../../../../global/styledForm";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Content,
  Panel,
} from "../../../../global/styledModal";
import { DividerBtn } from "../../../../global/styled";
import { WrapperItems } from "./styled";

const SigningGroupRename = ({ onModalClose, data }) => {
  const { t } = useTranslation("modal");
  const { combination_id, name } = data;

  const [isValid, setIsValid] = useState(true);
  const [value, setValue] = useState(name || "");
  const dispatch = useDispatch();
  const putSigningGroup = (data) => dispatch(putSigningGroupAction(data));
  const { isLoading } = useSelector((state) => state.settings);

  const onUpdate = (e) => {
    const val = e.target.value;
    setValue(val);

    if (!val || val.length < 1) {
      setIsValid(false);
      return;
    }

    setIsValid(true);
  };

  const onEdit = () => {
    if (!isValid) {
      return;
    }

    if (value === name) {
      onModalClose();
      return;
    }

    putSigningGroup({
      combination_id,
      name: value,
    });
  };

  return (
    <Wrapper width="470px">
      <Close onClick={onModalClose}>
        <Icon type="cancel" />
      </Close>

      <Title>{t("modal_signing_group_rename_title")}</Title>

      <Body>
        <Content>
          <WrapperItems>
            <Input
              value={value || ""}
              onChange={onUpdate}
              maxLength={255}
              placeholder={t("modal_signing_group_rename_placeholder")}
            />
          </WrapperItems>
        </Content>
      </Body>

      <Panel>
        <Button type="cancel" handleEvent={onModalClose}>
          {t("btn_cancel")}
        </Button>
        <DividerBtn />
        <Button
          type={!isLoading && isValid ? "primaryFlex" : "disabled"}
          handleEvent={!isLoading && isValid ? onEdit : null}
        >
          {t("btn_save")}
        </Button>
      </Panel>
    </Wrapper>
  );
};

export default SigningGroupRename;
