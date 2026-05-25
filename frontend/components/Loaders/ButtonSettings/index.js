import React from "react";
import ContentLoader from "react-content-loader";

const Loader = () => (
  <ContentLoader
    width={65}
    height={36}
    viewBox="0 0 65 36"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{
      borderRadius: "8px",
    }}
  >
    <rect x="0" y="0" rx="3" ry="3" width="65" height="36" />
  </ContentLoader>
);

export default Loader;
