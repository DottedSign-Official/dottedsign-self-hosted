import React from "react";
import App from "next/app";
import Router from "next/router";
import withReduxSaga from "next-redux-saga";
import { END } from "redux-saga";
import { connect } from "react-redux";
import { Chart, registerables } from "chart.js";
import { appWithTranslation } from "next-i18next";

import GlobalStyle from "./_globalStyle";

import wrapper from "../config/configureStore";
import * as authActions from "../redux/actions/auth";

import { getIp as getIpApi } from "../apis/others";
import { isExist } from "../helpers/others";
import LangLoader from "../containers/LangLoader";
import { setCSRFToken } from "../helpers/csrf/client";
import { setTokenCookies, setRefreshPath } from "../helpers/cookies";

const fetchProfile = async (access_token) => {
  return await fetch(`${process.env.BACKEND_HOST}/api/v1/members/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  }).then((data) => data.json());
};

const refreshTokens = async (ctx) => {
  const refresh_token = ctx.req.cookies.refresh_token;

  const getPathRefresh = (ctx) => {
    let myQs = "";

    if (isExist(ctx.req.query) && Object.keys(ctx.req.query).length > 0) {
      Object.keys(ctx.req.query).forEach((key, idx) => {
        if (idx === 0) {
          myQs += "?";
        }

        if (key === "lng") {
          return;
        }

        myQs += `${key}=${ctx.req.query[key]}`;

        if (idx !== Object.keys(ctx.req.query).length - 1) {
          myQs += "&&";
        }
      });
    }

    return encodeURIComponent(`${ctx.pathname}${myQs}`);
  };

  const refreshPath = getPathRefresh(ctx);
  try {
    // NOTE: refresh token
    const resp = await fetch(`${process.env.BACKEND_HOST}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.AUTH_CLIENT_ID,
        client_secret: process.env.AUTH_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token,
      }),
    });
    const data = await resp.json();
    if (data) {
      const { access_token, refresh_token, expires_in } = data;
      return { access_token, refresh_token, refreshPath, expires_in };
    }
    return {};
  } catch (error) {
    console.error("API request failed: ", error);
    return {};
  }
};

const getReqTokens = (ctx) => {
  const access_token = ctx.req.cookies.access_token;
  const refresh_token = ctx.req.cookies.refresh_token;
  return { access_token, refresh_token };
};

class MyApp extends App {
  constructor(props) {
    super(props);
    this.state = { isReady: false };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  static getInitialProps = async ({ Component, ctx }) => {
    let pageProps = {
      ...(Component.getInitialProps
        ? await Component.getInitialProps(ctx)
        : {}),
      pathname: ctx.pathname,
      csrfToken: ctx.req.csrfToken ? ctx.req.csrfToken() : "",
    };

    if (ctx.req) {
      ctx.store.dispatch(END);
      await ctx.store.sagaTask.toPromise();
    }

    if (
      !ctx.req ||
      ctx.pathname === "/_error" ||
      ctx.pathname === "/404" ||
      ctx.pathname === "/authorize"
    ) {
      return { pageProps };
    }

    const user = await fetchProfile(ctx.req.cookies.access_token);
    const isReqTokenValid = user?.data;
    const { access_token, refresh_token, refreshPath, expires_in } =
      isReqTokenValid ? getReqTokens(ctx) : await refreshTokens(ctx);
    const cookies = { access_token, refresh_token, refreshPath, expires_in };

    const redirectToLogin = () => {
      if (access_token) {
        ctx.res.clearCookie("access_token");
      }
      if (refresh_token) {
        ctx.res.clearCookie("refresh_token");
      }
      return ctx.res.redirect("/");
    };

    const resetPassword = () => {
      const { token } = ctx.req.query;
      return token && ctx.pathname === "/reset-password";
    };

    const inviteGroupMember = () => {
      const { invite_token } = ctx.req.query;
      return invite_token && ctx.pathname === "/groups/accept";
    };

    const fastSigning = () => {
      const { code } = ctx.req.query;
      return code && ctx.pathname === "/task";
    };

    const publicFormSigning = () => {
      const { uuid } = ctx.req.query;
      return uuid && ctx.pathname === "/public-form/sign";
    };

    if (!isExist(refresh_token)) {
      // NOTE: log-in free
      if (
        ctx.pathname === "/" ||
        ctx.pathname === "/ldap" ||
        ctx.pathname === "/preview-share-link" ||
        ctx.pathname.includes("/shorten_link") ||
        ctx.pathname === "/mobile-sign-panel" ||
        ctx.pathname === "/verification" ||
        ctx.pathname === "/reissue" ||
        resetPassword() ||
        inviteGroupMember() ||
        fastSigning() ||
        publicFormSigning()
      ) {
        return { pageProps };
      }

      return redirectToLogin();
    }

    try {
      // NOTE: get users
      const resp = isReqTokenValid ? user : await fetchProfile(access_token);

      // NOTE: member not found / something wrong
      if (resp.error_code || !resp.data) {
        return redirectToLogin();
      }

      if (ctx.pathname === "/" && resp.data) {
        const language = resp.data.language?.toLowerCase();
        const path = language === "en" ? "" : `${language}` || "";
        return ctx.res.redirect(`${path}/tasks`);
      }

      const isVerified = isExist(resp.data) && resp.data.confirmed;

      // NOTE: NOT verified, lock create pages
      if (
        !isVerified &&
        (ctx.pathname === "/create-task/prepare-doc" ||
          ctx.pathname === "/create-task/assign-fields" ||
          ctx.pathname === "/sign-and-send/prepare-doc" ||
          ctx.pathname === "/sign-and-send/assign-fields" ||
          ctx.pathname === "/template/prepare-doc" ||
          ctx.pathname === "/template/assign-fields")
      ) {
        return ctx.res.redirect("/tasks");
      }

      // NOTE: already verified, lock verification page
      if (isVerified && ctx.pathname === "/verification") {
        return ctx.res.redirect("/tasks");
      }

      // NOTE: organization
      let role;
      let organization;
      if (resp.data && isExist(resp.data.group_id)) {
        const response = await fetch(
          `${process.env.BACKEND_HOST}/api/v1/groups/${resp.data.group_id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          },
        );
        const resp4 = await response.json();

        if (resp4.data) {
          organization = resp4.data;
          const me = resp4.data.group_members.find(
            (mem) => mem.email === resp.data.email,
          );

          role = me !== undefined && me.roles[0];
        }
      }

      if (
        !resp.data.current_permission.view_users &&
        !resp.data.current_permission.manage_company_name &&
        !resp.data.current_permission.manage_company_logo &&
        ctx.pathname.indexOf("/admin/") > -1
      ) {
        return ctx.res.redirect("/_error");
      }

      // NOTE: features enabled
      const response2 = await fetch(
        `${process.env.BACKEND_HOST}/api/permissions`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      const resp2 = await response2.json();

      if (!resp2.data) {
        throw new Error("resp2.data is null or undefined");
      }

      if (
        !resp2.data.developer_console &&
        ctx.pathname.indexOf("/developer/") > -1
      ) {
        return ctx.res.redirect("/_error");
      }

      let userProps = {
        accessToken: access_token,
        organization,
        user: {
          ...resp.data,
          role,
        },
        features: resp2.data,
      };

      return {
        cookies,
        pageProps,
        userProps,
      };
    } catch (e) {
      return redirectToLogin();
    }
  };

  componentDidMount() {
    const {
      cookies,
      userProps,
      setUser,
      setGroup,
      setFeatureEnable,
      pageProps: { csrfToken },
    } = this.props;
    const scope = this;
    const setIsReady = () => scope.setState({ isReady: true });

    if (cookies) {
      const { access_token, refresh_token, refreshPath, expires_in } = cookies;
      setTokenCookies(access_token, refresh_token, expires_in);
      setRefreshPath(refreshPath, {
        expires: 24 * 60 * 60 * 1000,
      });
    }

    setCSRFToken(csrfToken);

    // NOTE: scroll
    Router.events.on("routeChangeComplete", () => {
      if (typeof window !== "undefined") {
        window.scroll({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      }
    });

    if (userProps) {
      setUser(userProps.user);
      setGroup(userProps.organization);
      setFeatureEnable(userProps.features);
    }

    Chart.register(...registerables);
    getIpApi()
      .then(setIsReady)
      .catch((e) => {
        console.error(e);
        setIsReady();
      });
  }

  render() {
    const { Component, pageProps, err } = this.props;

    return (
      <>
        <GlobalStyle />
        <LangLoader />
        {this.state.isReady && <Component {...pageProps} err={err} />}
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => {
      dispatch(authActions.setUser(user));
    },
    setGroup: (org) => {
      dispatch(authActions.setGroup(org));
    },
    setFeatureEnable: (features) => {
      dispatch(authActions.setFeatureEnable(features));
    },
  };
};

const MainApp = connect(null, mapDispatchToProps)(MyApp);

export default wrapper.withRedux(
  withReduxSaga({ async: true })(appWithTranslation(MainApp)),
);
