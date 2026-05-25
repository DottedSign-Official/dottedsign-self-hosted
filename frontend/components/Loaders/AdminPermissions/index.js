import React from "react";
import ContentLoader from "react-content-loader";

const Loader = () => (
  <ContentLoader
    width="100%"
    height={500}
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{
      backgroundColor: "#ffffff",
    }}
  >
    <rect x="0" y="0" rx="3" ry="3" width="100%" height="50" />
    <rect x="0" y="60" rx="3" ry="3" width="100%" height="50" />
    <rect x="0" y="120" rx="3" ry="3" width="100%" height="50" />
    <rect x="0" y="180" rx="3" ry="3" width="100%" height="50" />
    <rect x="0" y="240" rx="3" ry="3" width="100%" height="50" />
    <rect x="0" y="300" rx="3" ry="3" width="100%" height="50" />
    <rect x="0" y="360" rx="3" ry="3" width="100%" height="50" />
  </ContentLoader>
);

export default Loader;
