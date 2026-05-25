import { useMemo } from "react";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";

import Loader from "../../../Loaders/CheckboxList";
import Button from "../../../Button";
import Icon from "../../../Icon";
import Tooltip from "../../../TooltipExtend";

import { deleteTemplateAdminShare as deleteTemplateAdminShareAction } from "../../../../redux/actions/template";

import { openModal as openModalAction } from "../../../../redux/actions/common";
import { MODAL_TYPE } from "../../../../constants/constants";

import { DividerBtn } from "../../../../global/styled";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Content,
  Panel,
} from "../../../../global/styledModal";
import { GroupList, GroupItem, GroupName } from "./styled";

const DeleteTemplateAdminShare = ({ onModalClose, data }) => {
  const { t } = useTranslation("modal");

  const dispatch = useDispatch();
  const openModal = (data) => dispatch(openModalAction(data));
  const deleteTemplateAdminShare = (data) =>
    dispatch(deleteTemplateAdminShareAction(data));

  const { isLoading, templateShareList } = useSelector(
    (state) => state.template,
  );

  const sharingGroups = useMemo(() => {
    return templateShareList
      .filter((template) => template.template_id === data.templateId)
      .map((template) => template.share_groups)
      .flat();
  }, [templateShareList, data.templateId]);

  const handleCancelShare = (groupId) => {
    const onPrev = () => {
      openModal({
        modalType: MODAL_TYPE.deleteTemplateAdminShare,
        modalData: {
          templateId: data.templateId,
          filterType: data.filterType,
        },
      });
    };

    openModal({
      modalType: MODAL_TYPE.confirm,
      modalData: {
        title: "modal_template_admin_share_cancel_title",
        content: "modal_template_admin_share_confirm_deletion_content",
        confirmType: "warn",
        confirmButtonName: t("btn_confirm"),
        handleGoBack: onPrev,
        handleConfirm: () => {
          const isLastOne = sharingGroups.length === 1;
          deleteTemplateAdminShare({
            templateId: data.templateId,
            filterType: data.filterType,
            isCloseModal: isLastOne,
            groupId,
          });
        },
      },
    });
  };

  const content = () => {
    if (isLoading) {
      return <Loader />;
    }

    return (
      <GroupList>
        {sharingGroups.map((group) => (
          <GroupItem key={group.group_id}>
            <GroupName>
              <Tooltip text={group.name} />
            </GroupName>
            <Button
              type="warn"
              handleEvent={() => handleCancelShare(group.group_id)}
            >
              {t("template_more_cancel_share", { ns: "common" })}
            </Button>
          </GroupItem>
        ))}
      </GroupList>
    );
  };

  return (
    <Wrapper width="488px">
      <Close onClick={isLoading ? null : onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_template_admin_share_cancel_title")}</Title>
      <Body id="modal-body-scrollable">
        <Content>{content()}</Content>
      </Body>
      <Panel>
        <DividerBtn />
        <Button type="cancel" handleEvent={isLoading ? null : onModalClose}>
          {t("btn_close")}
        </Button>
      </Panel>
    </Wrapper>
  );
};

export default DeleteTemplateAdminShare;
