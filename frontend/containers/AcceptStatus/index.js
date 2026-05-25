import React, { useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { postAcceptance } from "../../redux/actions/accept";
import AcceptStatus from "../../components/AcceptStatus";
import { PageWrapper } from "../../global/styled";

const Acceptance = () => {
  const Router = useRouter();
  const dispatch = useDispatch();

  const accept = useSelector((state) => state.accept);

  useEffect(() => {
    const { invite_token } = Router.query;

    dispatch(postAcceptance({ invite_token }));
  }, [Router.query, dispatch]);

  const register = useCallback(
    (name, password) => {
      const { invite_token } = Router.query;
      dispatch(postAcceptance({ invite_token, password, name }));
    },
    [dispatch, Router],
  );

  const redirect = useCallback(() => {
    Router.push("/");
  }, [Router]);

  return (
    <PageWrapper isLoginPage>
      {accept?.status && (
        <AcceptStatus {...accept} register={register} redirect={redirect} />
      )}
    </PageWrapper>
  );
};

export default Acceptance;
