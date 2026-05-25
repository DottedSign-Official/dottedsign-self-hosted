import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { openModal as openModalAction } from "../../../../redux/actions/common";
import {
  clearSigningGroupParams as clearSigningGroupParamsAction,
  setSignerSettingsParams as setSignerSettingsParamsAction,
} from "../../../../redux/actions/modalCache";
import { useTranslation } from "react-i18next";
import { MODAL_TYPE, STAGE_TYPES } from "../../../../constants/constants";
import Icon from "../../../Icon";
import TagNumber from "../../../TagNumber";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Content,
} from "../../../../global/styledModal";
import {
  Section,
  Order,
  Name,
  Desc,
  Signers,
  Signer,
  WrapperTag,
  RecipientContainer,
  WrapperMore,
  RecipientType,
  ReceiverInfo,
} from "./styled";

const SignerContent = ({ signer, signingGroupIsOrder, onMore }) => {
  const { t } = useTranslation("modal");
  const isMore = false;

  const roleText = (() => {
    if (signer.stage_type == STAGE_TYPES.edit) {
      return "editor";
    }
    if (signer.stage_type == STAGE_TYPES.sign) {
      return "signer";
    }
    return "";
  })();

  return (
    <Signer isOrder={signingGroupIsOrder}>
      <WrapperTag>
        <TagNumber indx={signer.key} />
      </WrapperTag>

      <RecipientContainer>
        {roleText && (
          <RecipientType stageType={signer.stage_type}>
            {t(roleText)}
          </RecipientType>
        )}
        <ReceiverInfo>
          {signer.name} ({signer.email})
        </ReceiverInfo>
      </RecipientContainer>
      {isMore && (
        <WrapperMore onClick={onMore(signer)}>
          <Icon type="more" />
        </WrapperMore>
      )}
    </Signer>
  );
};

// NOTE: 3. cancel: clear cache
const SigningGroupDetail = () => {
  const { t } = useTranslation("modal");
  const {
    signingGroupName,
    signingGroupDesc,
    signingGroupIsOrder,
    signingGroupSigners,
  } = useSelector((state) => state.modalCache);
  const dispatch = useDispatch();
  const openModal = (data) => dispatch(openModalAction(data));
  const clearSigningGroupParams = () =>
    dispatch(clearSigningGroupParamsAction());
  const setSignerSettingsParams = (data) =>
    dispatch(setSignerSettingsParamsAction(data));

  const onMore = (signer) => () => {
    setSignerSettingsParams({
      isSignerSettingsReadOnly: true,
      signerSettingsPosition: "signingGroupImport",
      signerSettingsUid: signer.uid,
      signerSettingsSigners: signingGroupSigners,
      signerSettingsFunc: () => {},
    });

    openModal({ modalType: MODAL_TYPE.signerSettings });
    return;
  };

  const onCancel = () => {
    clearSigningGroupParams();
    openModal({ modalType: MODAL_TYPE.signingGroupImport });
  };

  if (!signingGroupSigners) {
    return null;
  }

  return (
    <Wrapper width="700px">
      <Close onClick={onCancel}>
        <Icon type="previous" />
      </Close>

      <Title>{t("modal_signing_group_details_title")}</Title>
      <Body>
        <Content>
          <Section>
            <Name>{signingGroupName}</Name>
            <Desc>{signingGroupDesc}</Desc>
          </Section>

          <Section>
            {signingGroupIsOrder && (
              <Order>{t("modal_signing_group_details_order")}</Order>
            )}

            <Signers>
              {signingGroupSigners?.map((signer) => (
                <SignerContent
                  t={t}
                  key={signer.key}
                  signer={signer}
                  signingGroupIsOrder={signingGroupIsOrder}
                  onMore={onMore}
                />
              ))}
            </Signers>
          </Section>
        </Content>
      </Body>
    </Wrapper>
  );
};

export default SigningGroupDetail;
