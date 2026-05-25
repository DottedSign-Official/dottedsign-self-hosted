import React from "react";
import ContentLoader from "react-content-loader";

const Loader = () => (
  <ContentLoader
    viewBox="0 0 1216 90"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{
      width: "100%",
      marginBottom: "1px",
      padding: "0 40px",
      backgroundColor: "#ffffff",
    }}
  >
    <rect x="0" y="35" width="200" height="15" />
    <rect x="0" y="60" width="250" height="14" />

    <rect x="410" y="10" width="40" height="12" />
    <circle cx="430" cy="45" r="16" />
    <rect x="410" y="66" width="40" height="12" />

    <rect x="456" y="45" width="696" height="3" />

    <rect x="1150" y="10" width="40" height="12" />
    <circle cx="1170" cy="45" r="16" />
    <rect x="1150" y="66" width="40" height="12" />
  </ContentLoader>
);

export default Loader;
