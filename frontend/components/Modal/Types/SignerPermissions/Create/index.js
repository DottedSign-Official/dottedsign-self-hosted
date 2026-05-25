import { isReviewAction } from "../../../../../helpers/assignees/review";
import { isFormSigner } from "../../../../../helpers/assignees/publicForm";
import { useTranslation } from "next-i18next";

import Icon from "../../../../Icon";
import Checkbox from "../../../../Checkbox";
import TagNumber from "../../../../TagNumber";
import data from "../data";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Content,
} from "../../../../../global/styledModal";
import { Item, User, Name, Permission, ItemPer, Label } from "../styled";

const SignerPermissionsCreate = ({
  onPrev,
  onPermissionToggle,
  isTemplate,
  assignes,
}) => {
  const { t } = useTranslation("modal");

  if (!assignes || assignes.length < 1) {
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
          {assignes.map((assigne, idx) => (
            <Item
              key={idx}
              $hidden={isReviewAction(assigne) || isFormSigner(assigne)}
            >
              <User>
                <TagNumber indx={assigne.key} />
                <Name>
                  {isTemplate
                    ? `${assigne.role}`
                    : `${assigne.name} (${assigne.email})`}
                </Name>
              </User>
              <Permission>
                {data.map((itm, indx) => (
                  <ItemPer key={indx}>
                    <Label>{t(itm.key)}</Label>
                    <Checkbox
                      isChecked={
                        assigne.stage_setting && assigne.stage_setting[itm.key]
                      }
                      onToggle={() => onPermissionToggle(idx, itm.key)}
                      isReadOnly={assigne.isMe}
                    />
                  </ItemPer>
                ))}
              </Permission>
            </Item>
          ))}
        </Content>
      </Body>
    </Wrapper>
  );
};

export default SignerPermissionsCreate;
