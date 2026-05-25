import React from "react";
import ContentLoader from "react-content-loader";

const Loader = () => (
  <ContentLoader
    viewBox="0 0 1040 600"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{
      width: "100%",
      backgroundColor: "#ffffff",
      padding: "15px 35px",
    }}
  >
    <rect x="0" y="20" rx="3" ry="3" width="120" height="20" />
    <rect x="0" y="55" rx="3" ry="3" width="100" height="16" />
    <rect x="0" y="115" rx="3" ry="3" width="100" height="16" />
    <rect x="310" y="55" rx="3" ry="3" width="400" height="32" />
    <rect x="310" y="115" rx="3" ry="3" width="400" height="32" />

    <rect x="0" y="230" rx="3" ry="3" width="120" height="20" />
    <rect x="0" y="270" rx="3" ry="3" width="100" height="16" />
    <rect x="0" y="330" rx="3" ry="3" width="100" height="16" />
    <rect x="0" y="390" rx="3" ry="3" width="100" height="16" />
    <rect x="0" y="450" rx="3" ry="3" width="100" height="16" />
    <rect x="310" y="270" rx="3" ry="3" width="400" height="32" />
    <rect x="310" y="330" rx="3" ry="3" width="400" height="32" />
    <rect x="310" y="390" rx="3" ry="3" width="400" height="32" />
    <rect x="310" y="450" rx="3" ry="3" width="400" height="32" />
  </ContentLoader>
);

export default Loader;
