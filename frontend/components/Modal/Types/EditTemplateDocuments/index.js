import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";
import * as createActions from "../../../../redux/actions/create";
import ListDocument from "../../../../containers/ListDocument";
import Icon from "../../../Icon";
import Button from "../../../Button";
import Tips from "../../../Tips";
import tips from "../../../../constants/tips";
import { DividerBtn } from "../../../../global/styled";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Content,
  Panel,
} from "../../../../global/styledModal";
import { WrapperAssignes } from "./styled";

const EditTemplateDocuments = ({ onModalClose }) => {
  const dispatch = useDispatch();

  const { t } = useTranslation("modal");
  const { tmpFiles } = useSelector((state) => state.create);

  const onClose = () => {
    onModalClose();
  };

  const onConfirm = () => {
    dispatch(createActions.setReplaceTemplate());
    onModalClose();
  };

  return (
    <Wrapper width="580px">
      <Close onClick={onClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_edit_template_documents_title")}</Title>
      <Body>
        <Tips type={tips.templateReplaceFileInfo} />
        <Content>
          <WrapperAssignes>
            <ListDocument tmpFiles={tmpFiles} isShowMore />
          </WrapperAssignes>
        </Content>
      </Body>
      <Panel>
        <Button type="cancel" handleEvent={onClose}>
          {t("btn_close")}
        </Button>
        <DividerBtn />
        <Button type="primaryFlex" handleEvent={onConfirm}>
          {t("btn_confirm")}
        </Button>
      </Panel>
    </Wrapper>
  );
};

export default EditTemplateDocuments;
