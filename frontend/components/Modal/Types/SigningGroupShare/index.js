import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { openToast as openToastAction } from "../../../../redux/actions/common";
import { postShareSigningGroup as postShareSigningGroupAction } from "../../../../redux/actions/settings";
import { getShareSigningGroup as getShareSigningGroupApi } from "../../../../apis/settings";
import toastType from "../../../../constants/toast";
import { rolesSystem } from "../../../../constants/constants";
import Loader from "../../../Loaders/ModalTemplateShareInfo";
import Checkbox from "../../../Checkbox";
import Icon from "../../../Icon";
import Button from "../../../Button";
import SelectRoleShare from "../../../SelectRoleShare";
import { DividerBtn } from "../../../../global/styled";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Content,
  Panel,
} from "../../../../global/styledModal";
import { WrapperBody, Items, Item, Label } from "./styled";

const SigningGroupShare = ({ onModalClose, data }) => {
  const { t } = useTranslation("modal");
  const { combination_id } = data;

  const [isInit, setIsInit] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  const [fields, setFields] = useState(null);

  const { isLoading } = useSelector((state) => state.settings);
  const dispatch = useDispatch();
  const openToast = useCallback(
    (data) => dispatch(openToastAction(data)),
    [dispatch],
  );
  const postShareSigningGroup = (data) =>
    dispatch(postShareSigningGroupAction(data));

  useEffect(() => {
    (async () => {
      const resp = await getShareSigningGroupApi({ combination_id });
      setIsInit(false);

      if (resp.error_code || !resp.data || !resp.data.group_share) {
        openToast({ payload: toastType.commonError });
        onModalClose();
        return;
      }

      setFields({ ...resp.data.group_share });
    })();
  }, [combination_id, onModalClose, openToast]);

  useEffect(() => {
    if (!fields) {
      return;
    }

    const isSharingTemp =
      Object.keys(fields).filter((role) => fields[role] === true).length > 0;

    setIsSharing(isSharingTemp);
  }, [fields]);

  const onShareToggle = () => {
    const oriFields = Object.keys(fields).reduce((acc, role) => {
      return { ...acc, [role]: false };
    }, {});

    if (isSharing) {
      setFields({ ...oriFields });
      return;
    }

    setFields({
      ...oriFields,
      admin: true,
      manager: true,
    });
  };

  const onFieldToggle = (key) => {
    if (key === "admin") {
      return;
    }

    setFields({
      ...fields,
      [key]: !fields[key],
    });
  };

  const onConfirm = () => {
    const payload = {
      combination_id,
      group_permission: { ...fields },
    };

    postShareSigningGroup(payload);
  };

  if (isInit) {
    return <Loader />;
  }

  if (!fields) {
    return null;
  }

  return (
    <Wrapper width="470px">
      <Close onClick={isLoading ? null : onModalClose}>
        <Icon type="cancel" />
      </Close>

      <Title>{t("modal_signing_group_share_title")}</Title>

      <Body>
        <Content>
          <WrapperBody>
            <Item>
              <Checkbox
                id={`chkbox-sharing`}
                isChecked={isSharing}
                onToggle={onShareToggle}
              />
              <Label>{t("modal_signing_group_share_title")}</Label>
            </Item>

            {isSharing && (
              <Items>
                {rolesSystem.map((role, idx) => (
                  <Item key={idx}>
                    <Checkbox
                      id={`chkbox-${idx}`}
                      isChecked={fields[role]}
                      onToggle={() => onFieldToggle(role)}
                      isReadOnly={role === "admin"}
                    />
                    <Label>{t(role)}</Label>
                  </Item>
                ))}

                <Item>
                  <SelectRoleShare fields={fields} setFields={setFields} />
                </Item>
              </Items>
            )}
          </WrapperBody>
        </Content>
      </Body>

      <Panel>
        <Button
          type={isLoading ? "disabled" : "cancel"}
          handleEvent={isLoading ? null : onModalClose}
        >
          {t("btn_cancel")}
        </Button>
        <DividerBtn />
        <Button
          type={isLoading ? "disabled" : "primaryFlex"}
          handleEvent={isLoading ? null : onConfirm}
        >
          {t("btn_confirm")}
        </Button>
      </Panel>
    </Wrapper>
  );
};

export default SigningGroupShare;
