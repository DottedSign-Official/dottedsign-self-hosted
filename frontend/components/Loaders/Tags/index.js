import React from "react";
import ContentLoader from "react-content-loader";

const Loader = () => (
  <ContentLoader
    viewBox="0 0 600 30"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <rect x="0" y="0" rx="15" ry="15" width="100" height="30" />
    <rect x="115" y="0" rx="15" ry="15" width="100" height="30" />
    <rect x="230" y="0" rx="15" ry="15" width="100" height="30" />
  </ContentLoader>
);

export default Loader;
