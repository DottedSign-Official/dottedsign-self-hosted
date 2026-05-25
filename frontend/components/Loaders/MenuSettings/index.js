import React from "react";
import ContentLoader from "react-content-loader";

const Loader = () => (
  <ContentLoader
    width={240}
    height={900}
    viewBox="0 0 240 900"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{
      paddingLeft: "20px",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
    }}
  >
    <rect x="0" y="12" rx="3" ry="3" width="210" height="16" />
    <rect x="0" y="57" rx="3" ry="3" width="210" height="16" />
    <rect x="0" y="102" rx="3" ry="3" width="210" height="16" />
    <rect x="0" y="147" rx="3" ry="3" width="210" height="16" />
    <rect x="0" y="192" rx="3" ry="3" width="210" height="16" />
    <rect x="0" y="237" rx="3" ry="3" width="210" height="16" />
    <rect x="0" y="282" rx="3" ry="3" width="210" height="16" />
  </ContentLoader>
);

export default Loader;
