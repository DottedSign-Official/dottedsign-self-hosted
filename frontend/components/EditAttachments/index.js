import React from "react";
import { useTranslation } from "next-i18next";
import CollapseContent from "../../containers/CollapseContent";
import TagNumber from "../TagNumber";
import Icon from "../Icon";
import {
  WrapperFieldBlock,
  TitleFieldBlock,
  FieldName,
  BtnAdd,
} from "../../global/styledCreate";
import {
  WrapperAttachments,
  Attachment,
  Name,
  WrapperIcon,
  WrapperDefault,
} from "./styled";

const childHead = ({ t, isViewOnly, onAdd }) => (
  <TitleFieldBlock>
    <FieldName isError={false}>{t("attachment_field")}</FieldName>
    {!isViewOnly && <BtnAdd onClick={onAdd}>{`+ ${t("btn_add")}`}</BtnAdd>}
  </TitleFieldBlock>
);

const childBody = ({
  t,
  isViewOnly,
  attachments,
  isEnvelope,
  fileFocus,
  onDel,
}) => (
  <WrapperAttachments>
    {attachments && attachments.length > 0 ? (
      attachments.map((atta, idx) => {
        if (isEnvelope && atta.envelope_file_id !== fileFocus.fileId) {
          return null;
        }

        return (
          <Attachment key={idx}>
            <TagNumber indx={atta.signer.key} />
            <Name>
              {atta.file_name}
              <span>
                {t(atta.force ? "required_bracket" : "optional_bracket")}
              </span>
            </Name>
            {!isViewOnly && (
              <WrapperIcon onClick={() => onDel(atta)}>
                <Icon type="cancel" size="18px" />
              </WrapperIcon>
            )}
          </Attachment>
        );
      })
    ) : (
      <WrapperDefault>N/A</WrapperDefault>
    )}
  </WrapperAttachments>
);

const EditAttachments = ({
  isViewOnly,
  isEnvelope,
  fileFocus,
  attachments,
  onAdd,
  onDel,
}) => {
  const { t } = useTranslation("create");
  return (
    <WrapperFieldBlock>
      <CollapseContent
        childHead={childHead({ t, isViewOnly, onAdd })}
        childBody={childBody({
          t,
          isViewOnly,
          attachments,
          isEnvelope,
          fileFocus,
          onDel,
        })}
        defaultVisible
      />
    </WrapperFieldBlock>
  );
};

export default EditAttachments;
