import React, { useRef, useState, useEffect } from "react";
import MobileDetect from "mobile-detect";
import { useTranslation } from "next-i18next";
import dataBadge from "../../Badge/data";
import dataset from "./data";
import Loader from "../../Loaders/PdfPageContainer";
import { Wrapper, Img, Title, Desc, Panel, Badge } from "./styled";

const Error = ({ type }) => {
  const { t } = useTranslation("common");

  const refTimer = useRef();
  const [isInit, setIsInit] = useState(true);

  useEffect(() => {
    refTimer.current = setTimeout(() => {
      setIsInit(false);
    }, 7000);

    return () => clearTimeout(refTimer.current);
  }, []);

  const md = new MobileDetect(window.navigator.userAgent);
  const data = type ? dataset[type] || dataset["default"] : dataset["default"];

  const dlod = () => {
    let link;
    if (md.os() === "iOS") {
      link = dataBadge["ios"].url;
    }

    if (md.os() === "AndroidOS") {
      link = dataBadge["android"].url;
    }

    if (link) {
      return (
        <Badge href={link} target="_blank" rel="noopener noreferrer">
          Download App
        </Badge>
      );
    }

    return null;
  };

  if (isInit) {
    return <Loader />;
  }

  return (
    <Wrapper id={data.id || ""}>
      <Img src="/static/images/404.png" alt="icon-error" />
      <Title>{t("error_pdf_title")}</Title>
      <Desc dangerouslySetInnerHTML={{ __html: t(data.text) }} />

      {type === "error" && <Panel>{dlod()}</Panel>}
    </Wrapper>
  );
};

export default Error;
