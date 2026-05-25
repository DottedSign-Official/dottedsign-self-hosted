import React from "react";
import ContentLoader from "react-content-loader";

const Loader = () => (
  <ContentLoader
    width="100%"
    height={120}
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{
      backgroundColor: "#ffffff",
    }}
  >
    <rect x="0" y="0" rx="3" ry="3" width="20%" height="30" />
    <rect x="0" y="40" rx="3" ry="3" width="40%" height="30" />
    <rect x="0" y="80" rx="3" ry="3" width="30%" height="30" />
  </ContentLoader>
);

export default Loader;
