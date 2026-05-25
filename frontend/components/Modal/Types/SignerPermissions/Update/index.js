import React from "react";
import { useTranslation } from "next-i18next";

import Icon from "../../../../Icon";
import Checkbox from "../../../../Checkbox";
import TagNumber from "../../../../TagNumber";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Content,
} from "../../../../../global/styledModal";
import { Item, User, Name, Permission, ItemPer, Label } from "../styled";

const SignerPermissionsUpdate = ({ onPrev, stagesUpdate, stageInfos }) => {
  const { t } = useTranslation("modal");

  const getStagePermissions = (stageId) => {
    const stageInfo = stageInfos.find((info) => info.stage_id === stageId);
    const decline_enable = stageInfo?.full_info?.stage_setting?.decline_enable;
    const forward_enable = stageInfo?.full_info?.stage_setting?.forward_enable;
    return { decline_enable, forward_enable };
  };

  if (!stagesUpdate || stagesUpdate.length < 1) {
    return null;
  }

  return (
    <Wrapper width="580px">
      <Close onClick={onPrev}>
        <Icon type="previous" />
      </Close>
      <Title>{t("modal_signer_permissions_title")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          {stagesUpdate.map((stage, idx) => {
            const { decline_enable, forward_enable } = getStagePermissions(
              stage.stage_id,
            );

            return (
              <Item key={idx}>
                <User>
                  <TagNumber indx={idx} />
                  <Name>{`${stage.name} (${stage.email})`}</Name>
                </User>
                <Permission>
                  <ItemPer>
                    <Label>{t("decline_enable")}</Label>
                    <Checkbox isChecked={decline_enable} isReadOnly />
                  </ItemPer>
                  <ItemPer>
                    <Label>{t("forward_enable")}</Label>
                    <Checkbox isChecked={forward_enable} isReadOnly />
                  </ItemPer>
                </Permission>
              </Item>
            );
          })}
        </Content>
      </Body>
    </Wrapper>
  );
};

export default SignerPermissionsUpdate;
