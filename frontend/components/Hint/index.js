import React, { useState, useEffect } from "react";
import { withRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";
import { openModal as openModalAction } from "../../redux/actions/common";
import { resendRequest as resendRequestAction } from "../../redux/actions/auth";
import { onAuth } from "../../helpers/auth";
import { getLicenseExpiryInfo } from "../../helpers/licenseExpiry";
import { AUTH_ERROR, LICENSE_EXPIRY_HINT } from "../../constants/constants";
import Icon from "../Icon";
import dataset from "./data";
import { Wrapper, Msg, WrapperIcon } from "./styled";

const Hint = ({ router, type }) => {
  const { t } = useTranslation("hint");

  const [isVisible, setIsVisible] = useState(true);
  const authRole = useSelector((state) => state.auth.user?.role);
  const adminRole = useSelector((state) => state.admin.role);
  const licenseData = useSelector((state) => state.license.data);
  const signerEmail = useSelector((state) => state.sign.signerEmail);
  const dispatch = useDispatch();
  const openModal = (data) => dispatch(openModalAction(data));
  const resendReq = () => dispatch(resendRequestAction());
  const role = authRole || adminRole;
  const isLicenseHintVisible = !type && ["admin", "manager"].includes(role);

  useEffect(() => {
    if (signerEmail && type && type === AUTH_ERROR.loginFirst) {
      const ele = document.getElementById("hintEmail");
      if (ele) {
        ele.innerHTML = signerEmail;
      }
    }
  }, [signerEmail, type]);

  const expiryInfo =
    isLicenseHintVisible && licenseData
      ? getLicenseExpiryInfo(licenseData)
      : null;

  const fallbackType = (() => {
    if (!expiryInfo) {
      return null;
    }
    if (expiryInfo.hintType === "warning") {
      return LICENSE_EXPIRY_HINT.warning;
    }
    if (expiryInfo.hintType === "expired") {
      return LICENSE_EXPIRY_HINT.expired;
    }
    return null;
  })();

  const data = dataset[type || fallbackType];

  const onEventTrigger = (e) => {
    if (e.target.id === "resendReq") {
      resendReq();
    } else if (e.target.id === "Task-Hint-Upgrade") {
      openModal({
        modalType: "upgrade",
        modalData: {
          upgradeId: {
            pro: "Task-Hint-UpgradeNow",
            business: "Task-Hint-UpgradeNowBiz",
          },
        },
      });
    } else if (e.target.id === "getStarted") {
      onAuth({ router, email: signerEmail });
    } else if (e.target.id === "nav-upgrade") {
      if (!role) {
        return;
      }
    } else if (e.target.id === "nav-license") {
      router.push("/settings/license");
    }
  };

  const onClose = () => {
    setIsVisible(false);
  };

  if (!data || !isVisible) {
    return null;
  }

  return (
    <Wrapper color={data.color}>
      <Msg
        id={data.id || ""}
        onClick={onEventTrigger}
        dangerouslySetInnerHTML={{ __html: t(data.msg) }}
      />
      {data.isClosable && (
        <WrapperIcon onClick={onClose}>
          <Icon type="close" size="16px" />
        </WrapperIcon>
      )}
    </Wrapper>
  );
};

export default withRouter(Hint);
