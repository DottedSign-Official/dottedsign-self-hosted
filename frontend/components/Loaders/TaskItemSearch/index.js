import React from "react";
import ContentLoader from "react-content-loader";

const Loader = () => (
  <ContentLoader
    viewBox="0 0 840 80"
    backgroundColor="#f3f3f3"
    foregroundColor="#ffffff"
    style={{
      width: "100%",
      borderRadius: "4px",
      margin: "5px 0",
    }}
  >
    <rect x="0" y="0" rx="3" ry="3" width="840" height="80" />
  </ContentLoader>
);

export default Loader;
