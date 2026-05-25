import React from "react";
import ContentLoader from "react-content-loader";

const Loader = () => (
  <ContentLoader
    width={112}
    height={112}
    viewBox="0 0 112 112"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{
      padding: "8px",
      borderRadius: "5px",
    }}
  >
    <rect x="0" y="0" rx="3" ry="3" width="96" height="96" />
  </ContentLoader>
);

export default Loader;
