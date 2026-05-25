import React from "react";
import ContentLoader from "react-content-loader";

const Loader = () => (
  <ContentLoader
    width={180}
    height={230}
    viewBox="0 0 180 230"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{
      margin: "30px 16px",
    }}
  >
    <rect x="10" y="10" rx="3" ry="3" width="160" height="180" />
    <rect x="10" y="210" rx="3" ry="3" width="160" height="20" />
  </ContentLoader>
);

export default Loader;
