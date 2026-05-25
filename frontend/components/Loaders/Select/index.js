import React from "react";
import ContentLoader from "react-content-loader";

const Loader = ({ width = 300 }) => (
  <ContentLoader
    width={width}
    height={43}
    viewBox={`0 0 ${width} 43`}
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <rect x="0" y="0" rx="3" ry="3" width={width} height="43" />
  </ContentLoader>
);

export default Loader;
