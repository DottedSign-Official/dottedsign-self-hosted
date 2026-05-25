import React from "react";
import ContentLoader from "react-content-loader";

const Loader = () => (
  <ContentLoader
    viewBox="0 0 280 52"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{
      width: "100%",
      marginBottom: "8px",
      borderRadius: "8px",
    }}
  >
    <rect x="0" y="0" rx="3" ry="3" width="280" height="52" />
  </ContentLoader>
);

export default Loader;
