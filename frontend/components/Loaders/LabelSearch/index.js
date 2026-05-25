import React from "react";
import ContentLoader from "react-content-loader";

const Loader = () => (
  <ContentLoader
    viewBox="0 0 840 21"
    backgroundColor="#f3f3f3"
    foregroundColor="#ffffff"
    style={{
      width: "100%",
      padding: "30px 0",
    }}
  >
    <rect x="0" y="0" rx="3" ry="3" width="200" height="21" />
  </ContentLoader>
);

export default Loader;
