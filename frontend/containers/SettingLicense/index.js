import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getLicense as getLicenseAction } from "../../redux/actions/license";
import { getLicenseExpiryInfo } from "../../helpers/licenseExpiry";
import SettingLicense from "../../components/SettingLicense";

const SettingLicenseContainer = () => {
  const dispatch = useDispatch();
  const { data, isLoading } = useSelector((state) => state.license);

  useEffect(() => {
    if (!data) {
      dispatch(getLicenseAction());
    }
  }, [data, dispatch]);

  const expiryInfo = data ? getLicenseExpiryInfo(data) : null;

  return (
    <SettingLicense isLoading={isLoading && !data} expiryInfo={expiryInfo} />
  );
};

export default SettingLicenseContainer;
