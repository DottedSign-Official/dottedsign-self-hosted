import React from "react";
import { useSelector, useDispatch } from "react-redux";
import * as authActions from "../../redux/actions/auth";
import Loader from "../../components/Loaders/Preference";
import SettingPreference from "../../components/SettingPreference";

const SettingPreferenceContainer = () => {
  const isLoading = useSelector((state) => state.auth.isLoading);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const putPreference = (data) => dispatch(authActions.putPreference(data));

  if (!user || isLoading) {
    return <Loader />;
  }

  const initialValue = {
    forget_remind: user.preference.forget_remind,
    expire_remind: user.preference.expire_remind,
    remind_days_before_expire: user.preference.remind_days_before_expire,
    receiver_lang: user.preference.receiver_lang,
    date_format: user.preference.date_format,
    signature_timestamp: user.preference.signature_timestamp,
    time_zone: user.preference.time_zone,
  };

  return (
    <SettingPreference initialValue={initialValue} onSubmit={putPreference} />
  );
};

export default SettingPreferenceContainer;
