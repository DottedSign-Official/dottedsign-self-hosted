import React from "react";
import { useSelector } from "react-redux";
import Avatar from "../../components/Avatar";
import AvatarLoader from "../../components/Loaders/Avatar";

const AvatarMy = ({ width }) => {
  const { user, isLoadingUser } = useSelector((state) => state.auth);
  if (isLoadingUser || !user?.icon_url) {
    return <AvatarLoader />;
  }
  return <Avatar width={width} src={user.icon_url} />;
};

export default AvatarMy;
