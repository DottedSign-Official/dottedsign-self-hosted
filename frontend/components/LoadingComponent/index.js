import React from "react";
import { Wrapper } from "./styled";
import Animate from "../Animate";
import AniLoading from "../../static/icons/loading.json";

const LoadingComponent = ({ width, height }) => (
  <Wrapper id="loading">
    <Animate width={width} height={height} animationData={AniLoading} />
  </Wrapper>
);

export default LoadingComponent;
