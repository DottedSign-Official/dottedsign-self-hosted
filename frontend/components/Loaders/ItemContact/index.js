import React from "react";
import ContentLoader from "react-content-loader";

const Loader = () => (
  <ContentLoader
    width={172}
    height={20}
    viewBox="0 0 172 20"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{ margin: "10px 8px" }}
  >
    <rect x="0" y="0" rx="4" ry="4" width="172" height="20" />
  </ContentLoader>
);

export default Loader;
