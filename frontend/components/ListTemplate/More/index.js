import React, { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useDispatch } from "react-redux";
import { openModal as openModalAction } from "../../../redux/actions/common";
import { putTemplateShare as putTemplateShareAction } from "../../../redux/actions/template";
import { MODAL_TYPE } from "../../../constants/constants";
import Icon from "../../Icon";
import { WrapperMore, WrapperIcon, Menu, MenuItem } from "./styled";

const More = ({ id, name, templateCode, tags, menuStatus }) => {
  const Router = useRouter();
  const { t } = useTranslation("common");

  const [isCollapse, setIsCollapse] = useState(true);
  const dispatch = useDispatch();
  const openModal = (data) => dispatch(openModalAction(data));
  const putTemplateShare = (data) => dispatch(putTemplateShareAction(data));

  const onToggle = () => {
    setIsCollapse(!isCollapse);
  };

  const onChangeCode = () => {
    openModal({
      modalType: MODAL_TYPE.templateChangeCode,
      modalData: {
        templateCode,
        templateId: id,
      },
    });
  };

  const onRename = () => {
    openModal({
      modalType: MODAL_TYPE.templateRename,
      modalData: {
        templateId: id,
        templateName: name,
      },
    });
  };

  const onEdit = () => {
    if (typeof window !== "undefined") {
      Router.push(`/template/assign-fields?template_id=${id}`);
    }
  };

  const onLabel = () => {
    openModal({
      modalType: MODAL_TYPE.labelManagement,
      modalData: {
        templateId: id,
        labels: tags,
        target: "template",
      },
    });
  };

  const onDel = () => {
    openModal({
      modalType: MODAL_TYPE.templateDel,
      modalData: {
        templateId: id,
      },
    });
  };

  const onShare = () => {
    putTemplateShare({ template_id: id });
  };

  const onCopy = () => {
    openModal({
      modalType: MODAL_TYPE.templateCopy,
      modalData: {
        templateId: id,
        templateName: name,
      },
    });
  };

  return (
    <WrapperMore>
      <WrapperIcon onClick={onToggle}>
        <Icon type="moreHorizontal" size="20px" />
      </WrapperIcon>

      {!isCollapse && (
        <Menu>
          {menuStatus === "sharable" && (
            <MenuItem onClick={onShare}>
              <WrapperIcon>
                <Icon type="share" size="20px" />
              </WrapperIcon>
              <p>{t("template_more_share_my_group")}</p>
            </MenuItem>
          )}

          {(menuStatus === "default" ||
            menuStatus === "sharing" ||
            menuStatus === "sharable") && (
            <>
              <MenuItem onClick={onRename}>
                <WrapperIcon>
                  <Icon type="menuRename" size="20px" />
                </WrapperIcon>
                <p>{t("task_more_rename")}</p>
              </MenuItem>
              <MenuItem onClick={onChangeCode}>
                <WrapperIcon>
                  <Icon type="edit" size="20px" />
                </WrapperIcon>
                <p>{t("template_more_id")}</p>
              </MenuItem>
              <MenuItem onClick={onEdit}>
                <WrapperIcon>
                  <Icon type="edit" size="20px" />
                </WrapperIcon>
                <p>{t("template_more_edit")}</p>
              </MenuItem>
              <MenuItem onClick={onLabel}>
                <WrapperIcon>
                  <Icon type="tag" size="22px" />
                </WrapperIcon>
                <p>{t("label_management")}</p>
              </MenuItem>
              <MenuItem onClick={onCopy}>
                <Icon type="copy" />
                <p>{t("template_more_copy")}</p>
              </MenuItem>
            </>
          )}

          {menuStatus === "shared" && (
            <MenuItem onClick={onEdit}>
              <WrapperIcon>
                <Icon type="menuDownload" size="20px" />
              </WrapperIcon>
              <p>{t("template_more_view")}</p>
            </MenuItem>
          )}

          {(menuStatus === "default" || menuStatus === "sharable") && (
            <MenuItem onClick={onDel}>
              <WrapperIcon>
                <Icon type="menuDelete" size="20px" />
              </WrapperIcon>
              <p>{t("task_more_delete")}</p>
            </MenuItem>
          )}
        </Menu>
      )}
    </WrapperMore>
  );
};

export default More;
