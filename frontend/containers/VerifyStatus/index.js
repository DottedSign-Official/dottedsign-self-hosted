import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { postVerify } from "../../redux/actions/verify";
import { VERIFY_STATUS } from "../../constants/constants";
import VerifyStatus from "../../components/VerifyStatus";

const Verification = () => {
  const Router = useRouter();

  const [isInit, setIsInit] = useState(true);
  const [isToken, setIsToken] = useState(false);
  const { isLoading, isVerified } = useSelector((state) => state.verify);
  const dispatch = useDispatch();

  useEffect(() => {
    const { token } = Router.query;
    setIsInit(false);

    if (!token) {
      setIsToken(false);
    } else {
      setIsToken(true);
      dispatch(postVerify({ confirmation_token: token }));
    }
  }, [Router.query, dispatch]);

  const status = (() => {
    if (isInit) {
      return null;
    }

    if (!isToken) {
      return VERIFY_STATUS.noToken;
    }

    if (isLoading) {
      return VERIFY_STATUS.verifyInprocess;
    }

    if (isVerified) {
      return VERIFY_STATUS.verifySuc;
    }

    return VERIFY_STATUS.verifyFal;
  })();

  if (!status) {
    return null;
  }

  return <VerifyStatus status={status} />;
};

export default Verification;
