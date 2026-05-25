import React from "react";
import ContentLoader from "react-content-loader";

const Loader = () => (
  <ContentLoader
    viewBox="0 0 1040 600"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      padding: "15px 35px",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
    }}
  >
    <rect x="0" y="10" rx="3" ry="3" width="210" height="20" />

    <rect x="0" y="55" rx="3" ry="3" width="100" height="16" />
    <circle cx="350" cy="85" r="30" />

    <rect x="0" y="140" rx="3" ry="3" width="100" height="16" />
    <rect x="0" y="180" rx="3" ry="3" width="100" height="16" />
    <rect x="0" y="220" rx="3" ry="3" width="100" height="16" />
    <rect x="310" y="140" rx="3" ry="3" width="100" height="16" />
    <rect x="310" y="180" rx="3" ry="3" width="100" height="16" />
    <rect x="310" y="220" rx="3" ry="3" width="100" height="16" />

    <rect x="0" y="260" rx="3" ry="3" width="65" height="36" />
  </ContentLoader>
);

export default Loader;
