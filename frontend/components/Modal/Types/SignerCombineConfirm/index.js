import React, { useEffect } from "react";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";
import { setStages as setStagesAction } from "../../../../redux/actions/create";
import { normalizeVisibleCAByEmail } from "../../../../helpers/visibleCA";
import Icon from "../../../Icon";
import Button from "../../../Button";
import { DividerBtn } from "../../../../global/styled";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Content,
  Panel,
} from "../../../../global/styledModal";
import { Text } from "./styled";

const SignerCombineConfirm = ({ onModalClose, data: { onConfirm } }) => {
  const { t } = useTranslation("modal");

  const { stages } = useSelector((state) => state.create);
  const dispatch = useDispatch();
  const setStages = (data) => dispatch(setStagesAction(data));

  const onConfirmClick = () => {
    onConfirm();
  };

  useEffect(() => {
    const newStages = normalizeVisibleCAByEmail(stages);
    if (JSON.stringify(newStages) !== JSON.stringify(stages)) {
      setStages(newStages);
    }
  }, []);

  return (
    <Wrapper width="470px">
      <Close onClick={onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_signer_combine_confirm_title")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          <Text>{t("modal_signer_combine_confirm_content")}</Text>
        </Content>
      </Body>
      <Panel>
        <Button type="cancel" handleEvent={onModalClose}>
          {t("btn_cancel")}
        </Button>
        <DividerBtn />
        <Button type="primaryFlex" handleEvent={onConfirmClick}>
          {t("btn_confirm")}
        </Button>
      </Panel>
    </Wrapper>
  );
};

export default SignerCombineConfirm;
