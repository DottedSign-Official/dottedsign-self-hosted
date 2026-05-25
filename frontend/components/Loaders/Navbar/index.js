import React from "react";
import ContentLoader from "react-content-loader";

const Loader = () => (
  <ContentLoader
    viewBox="0 0 1280 60"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{
      width: "100%",
      padding: "0 25px",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
    }}
  >
    <rect x="0" y="20" rx="3" ry="3" width="600" height="20" />
    <rect x="1000" y="12" rx="3" ry="3" width="120" height="36" />
    <circle cx="1150" cy="30" r="10" />
    <circle cx="1180" cy="30" r="10" />
    <circle cx="1210" cy="30" r="10" />
    <circle cx="1260" cy="30" r="20" />
  </ContentLoader>
);

export default Loader;
