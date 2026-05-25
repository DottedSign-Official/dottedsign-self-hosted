import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { openModal as openModalAction } from "../../redux/actions/common";
import { setSigningGroupImportParams as setSigningGroupImportParamsAction } from "../../redux/actions/modalCache";
import { useTranslation } from "react-i18next";
import { MODAL_TYPE } from "../../constants/constants";
import tooltip, { POSITION } from "../../constants/tooltip";
import Tooltip from "../../containers/Tooltip";
import { Wrapper, Btn, Tip } from "./styled";

const BtnSigningGroup = ({ isModal, isEnvelope }) => {
  const { t } = useTranslation("create");
  const { user } = useSelector((state) => state.auth);
  const {
    isTemplate,
    isTemplateEdit,
    isImportedTemplateReadOnly,
    templateId,
    assignes,
  } = useSelector((state) => state.create);
  const dispatch = useDispatch();
  const openModal = (data) => dispatch(openModalAction(data));
  const setSigningGroupImportParams = (data) =>
    dispatch(setSigningGroupImportParamsAction(data));

  const isAvailable = (() => {
    if (!user) {
      return false;
    }
    if (isTemplate) {
      return false;
    }
    if (isTemplateEdit) {
      return false;
    }
    if (isImportedTemplateReadOnly) {
      return false;
    }

    return true;
  })();

  const onModal = () => {
    const isHint = (() => {
      if (!isAvailable) {
        return false;
      }
      if (templateId) {
        return true;
      }
      if (assignes.length > 1) {
        return true;
      }
      if (assignes[0].name?.length > 0) {
        return true;
      }
      if (assignes[0].email?.length > 0) {
        return true;
      }
      if (assignes[0].verify?.length > 0) {
        return true;
      }
      if (assignes[0].others?.checked_skip_confirm) {
        return true;
      }
      return false;
    })();

    setSigningGroupImportParams({
      signingGroupImportShouldHint: isHint,
      isEnvelope,
    });
    openModal({ modalType: MODAL_TYPE.signingGroupImport });
  };

  if (!isAvailable) {
    return null;
  }

  return (
    <Wrapper>
      <Btn onClick={onModal} style={{ zIndex: 1 }}>
        {t("import_signing_group")}
      </Btn>
      {!isModal && (
        <Tip>
          <Tooltip type={tooltip.signingGroup} position={POSITION.topRight} />
        </Tip>
      )}
    </Wrapper>
  );
};

export default BtnSigningGroup;
