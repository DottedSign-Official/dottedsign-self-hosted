import React from "react";
import Animate from "../../Animate";
import loadingAnimation from "../../../static/animation/loading.json";
import { Wrapper, Content } from "./styled";

const Loading = ({ t }) => (
  <Wrapper>
    <Animate animationData={loadingAnimation} />
    <Content>{t("qrcode-wait-for-mobile-sign")}</Content>
  </Wrapper>
);

export default Loading;
