import React from "react";
import ContentLoader from "react-content-loader";

const Loader = () => (
  <ContentLoader
    width={375}
    height={600}
    viewBox="0 0 375 600"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{
      width: "100%",
      padding: "18px",
      backgroundColor: "#ffffff",
    }}
  >
    <rect x="0" y="0" rx="3" ry="3" width="120" height="32" />

    <rect x="25" y="80" rx="3" ry="3" width="325" height="24" />
    <rect x="0" y="120" rx="3" ry="3" width="375" height="20" />

    <rect x="120" y="200" rx="3" ry="3" width="140" height="42" />
    <rect x="120" y="260" rx="3" ry="3" width="140" height="42" />

    <rect x="86" y="320" rx="3" ry="3" width="200" height="80" />
  </ContentLoader>
);

export default Loader;
