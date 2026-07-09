import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { LICENSE_TYPE } from "../constants/licenseTypes";
import { getLicense as getLicenseAction } from "../redux/actions/license";

const licenseSelector = {
  [LICENSE_TYPE.LDAP]: (data) => data?.authenticate_member?.ldap_enable,
  [LICENSE_TYPE.SYSTEM_CA]: (data) =>
    data?.certificate_authority?.system_ca_enable,
  [LICENSE_TYPE.GROUP]: (data) => data?.group_enable,
  [LICENSE_TYPE.CHT_CERT]: (data) => data?.otp_verify?.cht_cert_enable,
  [LICENSE_TYPE.SMS]: (data) => data?.otp_verify?.sms_enable,
  [LICENSE_TYPE.SMTP]: (data) => data?.otp_verify?.smtp_enable,
  [LICENSE_TYPE.CHANGE_SIGNER]: (data) => data?.sign_task?.change_signer_enable,
  [LICENSE_TYPE.DECLINE_TASK]: (data) => data?.sign_task?.decline_task_enable,
  [LICENSE_TYPE.KIOSK_TASK]: (data) => data?.sign_task?.kiosk_task_enable,
  [LICENSE_TYPE.SIGN_VIDEO]: (data) => data?.sign_task?.sign_video_enable,
  [LICENSE_TYPE.GROUP_SHARE]: (data) => data?.template?.group_share,
  [LICENSE_TYPE.ENTERPRISE_PLAN]: (data) => data?.plan?.enterprise,
  [LICENSE_TYPE.ENCRYPTABLE]: (data) => data?.setting?.encryptable_enable,
};

export const useLicenseReady = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.license);

  useEffect(() => {
    if (!data) {
      dispatch(getLicenseAction());
    }
  }, [data, dispatch]);

  return !!data;
};

export const useLicenseHook = (type) => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.license);

  useEffect(() => {
    if (!data) {
      dispatch(getLicenseAction());
    }
  }, [data, dispatch]);

  return !!licenseSelector[type](data);
};
