import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";

import { openModal } from "../../../../redux/actions/common";
import {
  setInfo,
  postTemplate as postTemplateAction,
  putTemplate as putTemplateAction,
} from "../../../../redux/actions/create";
import { filterSignerAssignes } from "../../../../helpers/assignees/review";

import ButtonWithLoading from "../../../ButtonWithLoading";
import TagNumber from "../../../TagNumber";
import Icon from "../../../Icon";
import CollapseContent from "../../../../containers/CollapseContent";
import SelectLabels from "../../../../containers/SelectLabels";

import { MODAL_TYPE } from "../../../../constants/constants";
import { DividerBtn } from "../../../../global/styled";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Panel,
} from "../../../../global/styledModal";
import { Input } from "../../../../global/styledForm";
import {
  Content,
  Label,
  Roles,
  Role,
  Name,
  Items,
  Item,
  WrapperLabel,
  ChkboxLabel,
  WrapperInput,
  Link,
} from "./styled";

const CreateConfirmTemplate = ({ onModalClose }) => {
  const { t } = useTranslation(["modal", "create"]);

  const user = useSelector((state) => state.auth.user);
  const { isLoading, isTemplateEdit, assignes, templateCode, stages, labels } =
    useSelector((state) => state.create);

  const dispatch = useDispatch();
  const postTemplate = (data) => dispatch(postTemplateAction(data));
  const putTemplate = (data) => dispatch(putTemplateAction(data));

  const [code, setCode] = useState(templateCode);

  const onConfirm = () => {
    isTemplateEdit
      ? putTemplate({ templateCode: code, labels })
      : postTemplate({ templateCode: code, labels });
  };

  const onTemplateIdChange = (e) => {
    setCode(e.target.value);
  };

  const onLabelChange = (operation, tag) => {
    const itms = labels;
    const itm = tag;

    const updatedItms =
      operation === "add"
        ? [...(itms || []), itm]
        : operation === "delete"
        ? itms.filter((t) => t !== itm)
        : itms;

    dispatch(setInfo({ labels: updatedItms }));
  };

  const isPermissionsButton = user && stages?.length > 0;
  const isInfoUpdate = false;

  const onSignerPermissions = () => {
    dispatch(
      openModal({
        modalType: MODAL_TYPE.signerPermissions,
        modalData: {
          isInfoUpdate,
        },
      }),
    );
  };

  const bodySigners = () => {
    const filteredAssignes = filterSignerAssignes(assignes);

    return (
      <Content>
        <Label>{t("label_roles")}</Label>
        <Roles>
          {filteredAssignes &&
            filteredAssignes.map((ass, idx) => (
              <Role key={idx}>
                <TagNumber indx={ass.key} />
                <Name>{ass.role}</Name>
              </Role>
            ))}
        </Roles>
        {isPermissionsButton && (
          <Link onClick={onSignerPermissions}>{t("manage_permissions")}</Link>
        )}
      </Content>
    );
  };

  const bodySettings = () => (
    <Content>
      <Items>
        <Item>
          <WrapperLabel>
            <ChkboxLabel>{t("label_field", { ns: "create" })}</ChkboxLabel>
          </WrapperLabel>
          <WrapperInput>
            <SelectLabels
              optionsActive={labels}
              onUpdate={onLabelChange}
              target={"template"}
            />
          </WrapperInput>
        </Item>
      </Items>

      <Items>
        <Item>
          <WrapperLabel>
            <ChkboxLabel>{t("label_template_code")}</ChkboxLabel>
          </WrapperLabel>
          <WrapperInput>
            <Input
              disabled={templateCode}
              onChange={onTemplateIdChange}
              value={code}
            />
          </WrapperInput>
        </Item>
      </Items>
    </Content>
  );

  return (
    <Wrapper width="580px">
      <Close onClick={isLoading ? () => {} : onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>
        {t(
          isTemplateEdit
            ? "modal_template_edit_title"
            : "modal_template_confirm_title",
        )}
      </Title>
      <Body id="modal-body-scrollable">
        <CollapseContent
          childHead={t("modal_review_send_signers")}
          childBody={bodySigners()}
          defaultVisible={true}
        />

        <CollapseContent
          childHead={t("modal_review_send_settings")}
          childBody={bodySettings()}
          defaultVisible={true}
        />
      </Body>
      <Panel>
        <ButtonWithLoading
          isLoading={isLoading}
          type="cancel"
          handleEvent={onModalClose}
        >
          {t("btn_cancel")}
        </ButtonWithLoading>
        <DividerBtn />
        <ButtonWithLoading
          isLoading={isLoading}
          type="primaryFlex"
          handleEvent={onConfirm}
        >
          {isTemplateEdit ? t("btn_save") : t("btn_confirm")}
        </ButtonWithLoading>
      </Panel>
    </Wrapper>
  );
};

export default CreateConfirmTemplate;
