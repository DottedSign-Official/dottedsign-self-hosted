import React from "react";
import ContentLoader from "react-content-loader";

const Loader = () => (
  <ContentLoader
    viewBox="0 0 768 40"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{
      width: "100%",
      height: "53px",
      backgroundColor: "#ffffff",
    }}
  >
    <rect x="0" y="12" rx="3" ry="3" width="200" height="20" />
  </ContentLoader>
);

export default Loader;
