import React from "react";
import ContentLoader from "react-content-loader";

const Loader = () => (
  <ContentLoader
    viewBox="0 0 1040 660"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{
      marginBottom: "8px",
      borderRadius: "8px",
    }}
  >
    <rect x="0" y="0" rx="3" ry="3" width="100" height="26" />
    <rect x="0" y="50" rx="3" ry="3" width="300" height="43" />
    <rect x="0" y="113" rx="3" ry="3" width="300" height="43" />
    <rect x="0" y="176" rx="3" ry="3" width="300" height="43" />
    <rect x="0" y="239" rx="3" ry="3" width="300" height="43" />
    <rect x="0" y="302" rx="3" ry="3" width="100" height="26" />
  </ContentLoader>
);

export default Loader;
