import React from "react";
import ContentLoader from "react-content-loader";

const Loader = () => (
  <ContentLoader
    viewBox="0 0 530 200"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{
      width: "100%",
      padding: "0 25px",
    }}
  >
    <rect x="0" y="5" rx="3" ry="3" width="400" height="20" />

    <rect x="0" y="50" rx="3" ry="3" width="530" height="32" />
    <rect x="0" y="100" rx="3" ry="3" width="530" height="32" />
    <rect x="0" y="150" rx="3" ry="3" width="530" height="32" />
  </ContentLoader>
);

export default Loader;
