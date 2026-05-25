import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProfile,
  putProfile as putProfileAction,
} from "../../redux/actions/auth";
import SettingProfile from "../../components/SettingProfile";

const SettingProfileContainer = () => {
  const {
    isLoading,
    user: { profile },
  } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const putProfile = (data) => dispatch(putProfileAction(data));

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  return (
    <SettingProfile
      isLoading={isLoading || !profile}
      initialValue={profile}
      onSubmit={putProfile}
    />
  );
};

export default SettingProfileContainer;
