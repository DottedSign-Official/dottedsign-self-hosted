import React, { useEffect, useRef } from "react";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";

import {
  getAssigneeSystemCAList,
  clearSystemCAAccessRight,
} from "../../redux/actions/create";

import Phone from "../../containers/InputPhone";
import Icon from "../Icon";
import Select from "../../containers/Select";
import SelectLoader from "../Loaders/Select";
import { Wrapper, WrapperPhone, Hint } from "./styled";

import { useLicenseHook } from "../../helpers/license";
import { LICENSE_TYPE } from "../../constants/licenseTypes";

import SystemCASelect from "./SystemCASelect";

const getAuthMethods = (t) => {
  return {
    no: {
      text: t("no_need"),
      val: [],
    },
    email: {
      text: t("otp_email"),
      val: [{ sequence: 1, verify_type: "email" }],
    },
    sms: {
      text: t("otp_sms"),
      val: [{ sequence: 1, verify_type: "sms" }],
    },
    emailAndSms: {
      text: t("otp_both"),
      val: [
        { sequence: 1, verify_type: "sms" },
        { sequence: 1, verify_type: "email" },
      ],
    },
    cht_personal: {
      text: t("cht_personal"),
      val: [{ sequence: 1, verify_type: "cht_personal", occassion: "sign" }],
    },
    cht_company: {
      text: t("cht_company"),
      val: [{ sequence: 1, verify_type: "cht_company", occassion: "sign" }],
    },
    cht_system: {
      text: t("cht_system"),
      val: [{ sequence: 1, verify_type: "cht_system", occassion: "sign" }],
    },
  };
};

const AuthMethod = ({ verifyMethod = [], onUpdate, target }) => {
  const { t } = useTranslation("modal");
  const AUTH_METHODS = getAuthMethods(t);
  const isCheckedSystemAccessRight = useRef(false);

  const { user } = useSelector((state) => state.auth);
  const { isAccessSystemCA, isLoading, isPublicForm } = useSelector(
    (state) => state.create,
  );

  const licenseSmtp = useLicenseHook(LICENSE_TYPE.SMTP);
  const licenseCht = useLicenseHook(LICENSE_TYPE.CHT_CERT);
  const licenseSystemCA = useLicenseHook(LICENSE_TYPE.SYSTEM_CA);
  const licenseSMS = useLicenseHook(LICENSE_TYPE.SMS);

  const dispatch = useDispatch();

  // NOTE: Each signer access right is diff, so clear it in init
  useEffect(() => {
    dispatch(clearSystemCAAccessRight());
  }, [dispatch]);

  // NOTE: First get system ca access right
  useEffect(() => {
    if (target && target.email && !isCheckedSystemAccessRight.current) {
      dispatch(
        getAssigneeSystemCAList({
          email: target.email,
        }),
      );
      isCheckedSystemAccessRight.current = true;
    }
  }, [target, dispatch]);

  const verifyCandidates = (() => {
    if (!user) {
      return [AUTH_METHODS.no];
    }
    let candidates = [AUTH_METHODS.no];

    if (licenseSmtp) {
      candidates = [...candidates, AUTH_METHODS.email];
    }
    if (licenseSMS) {
      candidates = [...candidates, AUTH_METHODS.sms];
    }
    if (licenseSmtp && licenseSMS) {
      candidates = [...candidates, AUTH_METHODS.emailAndSms];
    }

    if (licenseCht) {
      candidates = [
        ...candidates,
        AUTH_METHODS.cht_personal,
        AUTH_METHODS.cht_company,
      ];
    }

    if (licenseSystemCA && isAccessSystemCA) {
      candidates = [...candidates, AUTH_METHODS.cht_system];
    }

    // NOTE: public form: phone-based verification is not provided
    return isPublicForm
      ? candidates.filter(
          (itm) => itm !== AUTH_METHODS.sms && itm !== AUTH_METHODS.emailAndSms,
        )
      : candidates;
  })();

  const activeVerifyCandidate = (() => {
    if (verifyMethod.length < 1) {
      return AUTH_METHODS.no;
    }

    return Object.values(AUTH_METHODS).filter((cand) => {
      const candMethod = cand.val;
      if (candMethod.length !== verifyMethod.length) {
        return false;
      }

      let isMatched = true;
      verifyMethod.forEach((act) => {
        const matched = candMethod.find(
          (cand) => cand.verify_type === act.verify_type,
        );

        if (typeof matched === "undefined") {
          isMatched = false;
        }
      });

      return isMatched;
    })[0];
  })();

  const onSelect = (itm) => {
    onUpdate(itm.val);
  };

  const smsVerification = verifyMethod.find((itm) => itm.verify_type === "sms");
  const isSms = smsVerification;
  const originalPhoneNumber = smsVerification?.verify_source;

  const onPhoneChange = (value) => {
    if (value) {
      const newVerifyMethod = verifyMethod.map((itm) =>
        itm.verify_type === "sms" ? { ...itm, verify_source: value } : itm,
      );
      onUpdate(newVerifyMethod);
    }
  };

  if (isLoading) {
    return (
      <Wrapper>
        <SelectLoader width={500} />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Select
        activeItem={activeVerifyCandidate}
        items={verifyCandidates}
        indexKey={"val"}
        indexText={"text"}
        onSelectEvent={onSelect}
        isFlat
      />
      <SystemCASelect verifyMethod={verifyMethod} onUpdate={onUpdate} />
      {isSms && (
        <WrapperPhone>
          <Phone
            originalPhoneNumber={originalPhoneNumber}
            onChange={onPhoneChange}
          />
          <Hint>
            <Icon type="tips" size="16px" />
            <p>{t("hint-opt-phone")}</p>
          </Hint>
        </WrapperPhone>
      )}
    </Wrapper>
  );
};

export default AuthMethod;
