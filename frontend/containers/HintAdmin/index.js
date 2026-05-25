import React from "react";
import { useSelector } from "react-redux";
import { GROUP_HINT } from "../../constants/constants";
import Hint from "../../components/Hint";

const HintAdmin = () => {
  const { isExpired, role } = useSelector((state) => state.admin);
  const admin = useSelector((state) => state.admin);

  if (!admin || !isExpired) {
    return null;
  }

  let type;
  if (role === "admin") {
    type = GROUP_HINT.groupExpiredAdmin;
  } else if (role === "manager") {
    type = GROUP_HINT.groupExpired;
  }

  if (type) {
    return <Hint type={type} />;
  }

  return null;
};

export default HintAdmin;
