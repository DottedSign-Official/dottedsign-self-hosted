import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { setFrontDeskIni, clearFrontDesk } from "../../redux/actions/auth";
import { setFileInstructions } from "../../redux/actions/create";
import { COMMON_ERROR } from "../../constants/constants";
import WindowWidth from "../../containers/WindowWidth";
import Loader from "../../components/Loaders/ContentDocument";
import Cover from "../../components/Cover";
import ContDocSettings from "../ContDocSettings";
import Content from "../ContentIntegrationKiosk";
import CoverDlod from "../../components/CoverDownloadApp";

const ContentFrontDesk = ({ windowWidth }) => {
  const refTimer = useRef(null);
  const [isInit, setIsInit] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const { isFrontDeskDone, fileName, fileInstructions, templateId, assignes } =
    useSelector((state) => state.create);
  const dispatch = useDispatch();

  const stages = React.useMemo(
    () =>
      assignes.map((ass) => ({
        others: {
          informable: !!ass.informable,
          requisite: {
            name: "required",
            email: "optional",
            phone: "disabled",
          },
        },
        role: ass.name,
      })),
    [assignes],
  );

  const router = useRouter();

  useEffect(() => {
    dispatch(setFrontDeskIni());

    return () => dispatch(clearFrontDesk());
  }, [dispatch]);

  useEffect(() => {
    return () => dispatch(setFileInstructions(""));
  }, [dispatch]);

  useEffect(() => {
    refTimer.current = setTimeout(() => {
      setIsInit(false);
    }, [5000]);

    return () => {
      if (refTimer.current) {
        clearTimeout(refTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isInit && user) {
      setIsInit(false);
      clearTimeout(refTimer.current);
    }
  }, [user, isInit]);

  if (!windowWidth || windowWidth < 1) {
    return <Loader />;
  }

  if (windowWidth < 768) {
    return <CoverDlod />;
  }

  if (!user) {
    if (isInit) {
      return <Loader />;
    }

    router.push("/");
    return null;
  }

  const isAvailable = true;
  // NOTE: user.group_status === "group_active" &&
  // NOTE: user.group_permission &&
  // NOTE: user.group_permission.allow_kiosk;

  if (!isAvailable) {
    return <Cover type={COMMON_ERROR.notAuthorized} isVisible />;
  }

  if (!isFrontDeskDone) {
    return (
      <ContDocSettings page="front-desk" isTemplateOnly isSigners isFrontDesk />
    );
  }

  return (
    <Content
      file_name={fileName}
      file_instructions={fileInstructions}
      template_id={templateId}
      stages={stages}
      inform_enable
    />
  );
};

export default WindowWidth(ContentFrontDesk);
