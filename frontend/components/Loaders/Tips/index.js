import React from "react";
import ContentLoader from "react-content-loader";

const Loader = () => (
  <ContentLoader
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{
      width: "100%",
      height: "52px",
      padding: "12px 35px",
      backgroundColor: "rgba(0, 0, 0, 0.1)",
    }}
  >
    <circle cx={12} cy={12} r={12} />
    <rect x="32" y="0" rx="3" ry="3" width="240" height="20" />
  </ContentLoader>
);

export default Loader;
