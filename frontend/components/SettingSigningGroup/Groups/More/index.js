import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";
import { openModal as openModalAction } from "../../../../redux/actions/common";
import { setSigningGroupParams as setSigningGroupParamsAction } from "../../../../redux/actions/modalCache";
import { MODAL_TYPE } from "../../../../constants/constants";
import { getCompleteSigners } from "../../../../helpers/signingGroup";
import Icon from "../../../Icon";
import { Wrapper, More, Menu, MenuItem, WrapperIcon } from "./styled";

const MoreMenu = ({ group }) => {
  const { t } = useTranslation("common");

  const refTimer = useRef(null);
  const [isCollapse, setIsCollapse] = useState(true);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const openModal = (data) => dispatch(openModalAction(data));
  const setSigningGroupParams = (data) =>
    dispatch(setSigningGroupParamsAction(data));

  const onToggle = () => {
    setIsCollapse(!isCollapse);
  };

  const onFocus = () => {
    if (refTimer.current) {
      clearTimeout(refTimer.current);
    }
  };

  const onBlur = () => {
    refTimer.current = setTimeout(() => {
      setIsCollapse(true);
    });
  };

  const isReadOnly = (() => {
    if (!group) {
      return true;
    }
    if (!group.share_info) {
      return true;
    }
    if (group.share_info.share_by_others) {
      return true;
    }
    return false;
  })();

  const isSharable = user?.current_permission?.share_combination;

  const onOpenGroupSigning = async () => {
    const signers = await getCompleteSigners(group);

    setSigningGroupParams({
      isSigningGroupReadOnly: isReadOnly,
      signingGroupId: group.combination_id,
      signingGroupName: group.name || "",
      signingGroupDesc: group.description || "",
      signingGroupIsOrder: group.has_order,
      signingGroupSigners: signers,
    });

    openModal({ modalType: MODAL_TYPE.signingGroup });
  };

  const onRename = () => {
    if (isReadOnly) {
      return;
    }

    openModal({
      modalType: MODAL_TYPE.signingGroupRename,
      modalData: { combination_id: group.combination_id, name: group.name },
    });
  };

  const onShare = () => {
    if (isReadOnly) {
      return;
    }
    if (!isSharable) {
      return;
    }

    openModal({
      modalType: MODAL_TYPE.signingGroupShare,
      modalData: { combination_id: group.combination_id },
    });
  };

  const onDelete = () => {
    if (isReadOnly) {
      return;
    }

    openModal({
      modalType: MODAL_TYPE.signingGroupDelete,
      modalData: {
        combination_id: group.combination_id,
        isShared: group?.share_info?.share_by_me,
      },
    });
  };

  if (!group) {
    return null;
  }

  return (
    <Wrapper tabIndex={1} onFocus={onFocus} onBlur={onBlur}>
      <More onClick={onToggle}>
        <Icon type="more" size="16px" />
      </More>

      {!isCollapse && (
        <Menu>
          {isReadOnly ? (
            <MenuItem onClick={onOpenGroupSigning}>
              <WrapperIcon>
                <Icon type="search" />
              </WrapperIcon>
              <p>{t("btn_view")}</p>
            </MenuItem>
          ) : (
            <>
              <MenuItem onClick={onOpenGroupSigning}>
                <WrapperIcon>
                  <Icon type="edit" />
                </WrapperIcon>
                <p>{t("template_more_edit")}</p>
              </MenuItem>

              <MenuItem onClick={onRename}>
                <WrapperIcon>
                  <Icon type="menuRename" />
                </WrapperIcon>
                <p>{t("task_more_rename")}</p>
              </MenuItem>

              {isSharable && (
                <MenuItem onClick={onShare}>
                  <WrapperIcon>
                    <Icon type="share" />
                  </WrapperIcon>
                  <p>
                    {group.share_info.share_by_me
                      ? t("more_share_manage")
                      : t("more_share")}
                  </p>
                </MenuItem>
              )}

              <MenuItem onClick={onDelete}>
                <WrapperIcon>
                  <Icon type="menuDelete" />
                </WrapperIcon>
                <p>{t("task_more_delete")}</p>
              </MenuItem>
            </>
          )}
        </Menu>
      )}
    </Wrapper>
  );
};

export default MoreMenu;
