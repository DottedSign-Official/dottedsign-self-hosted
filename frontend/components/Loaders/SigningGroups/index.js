import React from "react";
import ContentLoader from "react-content-loader";

const Loader = () => (
  <ContentLoader
    viewBox="0 0 1040 860"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{
      width: "100%",
      backgroundColor: "#ffffff",
    }}
  >
    <rect x="0" y="0" rx="3" ry="3" width="1040" height="50" />
    <rect x="0" y="70" rx="3" ry="3" width="1040" height="50" />
    <rect x="0" y="140" rx="3" ry="3" width="1040" height="50" />
    <rect x="0" y="210" rx="3" ry="3" width="1040" height="50" />
    <rect x="0" y="280" rx="3" ry="3" width="1040" height="50" />
  </ContentLoader>
);

export default Loader;
