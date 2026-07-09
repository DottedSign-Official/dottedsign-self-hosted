import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";

import {
  openModal as openModalAction,
  openToast as openToastAction,
} from "../../../../redux/actions/common";
import { setSignerSettingsParams as setSignerSettingsParamsAction } from "../../../../redux/actions/modalCache";
import { hasChtVerify } from "../../../../helpers/assignees/cht";

import toastType from "../../../../constants/toast";
import { MODAL_TYPE } from "../../../../constants/constants";
import Icon from "../../../Icon";
import AuthMethod from "../../../AuthMethod";
import { isTaiwanPhone as isPhone } from "../../../../helpers/utility";
import AuthTiming from "../../../../components/AuthTiming";
import Tooltip from "../../../../containers/Tooltip";
import tooltipType from "../../../../constants/tooltip";

import {
  Wrapper,
  Close,
  Title,
  Body,
  Content,
} from "../../../../global/styledModal";
import { WrapperSections, Section, Label } from "./styled";

const ModalAuthMethod = ({ data }) => {
  const { t } = useTranslation("modal");
  const { uid, email } = data;

  const { signerSettingsSigners } = useSelector((state) => state.modalCache);
  const { is_encrypted } = useSelector((state) => state.create);

  const dispatch = useDispatch();
  const openModal = (data) => dispatch(openModalAction(data));
  const openToast = (data) => dispatch(openToastAction(data));
  const setSignerSettingsParams = (data) =>
    dispatch(setSignerSettingsParamsAction(data));

  const [signerFocus, setSignerFocus] = useState(null);

  const signers = signerSettingsSigners;

  const updateTargets = (tars) => {
    setSignerSettingsParams({ signerSettingsSigners: tars });
  };

  useEffect(() => {
    if (!signers || !uid) {
      return;
    }

    const signer = signers.filter((target) => target["uid"] === uid)[0];

    if (signer) {
      setSignerFocus(signer);
      return;
    }
  }, [signers, uid]);

  // NOTE: enforce reviewed_skip_confirm
  useEffect(() => {
    if (!signerFocus?.verify) {
      return;
    }

    const isCht = hasChtVerify([signerFocus.verify[0]].filter(Boolean));

    const valSkipConfirm = signerFocus?.stage_setting?.reviewed_skip_confirm;

    if (isCht && valSkipConfirm) {
      const signersNew = signers.map((signer) => {
        if (signer.uid !== uid) {
          return signer;
        }

        return {
          ...signer,
          stage_setting: {
            ...signer.stage_setting,
            reviewed_skip_confirm: false,
          },
        };
      });

      updateTargets(signersNew);
    }
  }, [signerFocus, signers, uid]);

  const needVerify = (() => {
    return signerFocus?.verify?.length > 0;
  })();

  // NOTE: validates focused signer
  const prevValidation = (() => {
    if (!signerFocus || !signerFocus.verify) {
      return { isValid: true };
    }

    if (is_encrypted && hasChtVerify(signerFocus.verify)) {
      return {
        isValid: false,
        toastType: toastType.encryptionChtAuthConflict,
      };
    }

    const smsItm = signerFocus?.verify?.find(
      (itm) => itm.verify_type === "sms",
    );

    if (typeof smsItm === "undefined") {
      return { isValid: true };
    }
    if (!isPhone(smsItm.verify_source)) {
      return { isValid: false, toastType: toastType.invalidPhone };
    }

    return { isValid: true };
  })();

  const onPrevious = () => {
    if (!prevValidation.isValid) {
      openToast({ payload: prevValidation.toastType });
      return;
    }

    openModal({ modalType: MODAL_TYPE.signerSettings });
  };

  const onUpdateMethods = (verifyMethod) => {
    const isTargetCht = hasChtVerify(verifyMethod);

    const newSigners = signers.map((signer) => {
      const isCurrentCht = hasChtVerify(signer.verify);

      if (
        (signer.email === email && isTargetCht && isCurrentCht) ||
        signer.uid === uid
      ) {
        const currentTiming = signer.verify?.[0]?.occassion || "sign";

        return {
          ...signer,
          verify: verifyMethod.map((verify) => ({
            occassion: currentTiming,
            ...verify,
          })),
        };
      }

      return signer;
    });

    updateTargets(newSigners);
  };

  const onUpdateTiming = (timing) => {
    const signersNew = signers.map((signer) => {
      if (signer.uid !== uid) {
        return signer;
      }

      return {
        ...signer,
        verify: signer.verify.map((verify) => ({
          ...verify,
          occassion: timing,
        })),
      };
    });

    updateTargets(signersNew);
  };

  if (!uid || !signers || !signerFocus) {
    return null;
  }

  return (
    <Wrapper>
      <Close onClick={onPrevious}>
        <Icon type="previous" />
      </Close>

      <Title>{t("identity_verify_methods")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          <WrapperSections>
            <Section>
              <Label>{t("identity_verify_methods")}</Label>
              <AuthMethod
                verifyMethod={signerFocus.verify || []}
                onUpdate={onUpdateMethods}
                target={signerFocus}
              />
            </Section>

            {needVerify && (
              <Section>
                <Label>
                  {t("identity_verify_timing")}
                  <span>
                    <Tooltip type={tooltipType.verifyTiming} position={"top"} />
                  </span>
                </Label>
                <AuthTiming
                  verifyMethod={signerFocus.verify}
                  onUpdate={onUpdateTiming}
                />
              </Section>
            )}
          </WrapperSections>
        </Content>
      </Body>
    </Wrapper>
  );
};

export default ModalAuthMethod;
