import React from "react";
import ContentLoader from "react-content-loader";

const Loader = () => (
  <ContentLoader
    width={240}
    height={24}
    viewBox="0 0 240 24"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{
      marginBottom: "20px",
      borderRadius: "8px",
    }}
  >
    <rect x="0" y="0" rx="3" ry="3" width="240" height="21" />
  </ContentLoader>
);

export default Loader;
