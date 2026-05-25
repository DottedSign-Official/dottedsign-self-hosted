import React from "react";
import ContentLoader from "react-content-loader";

const Loader = () => (
  <ContentLoader
    width={450}
    height={150}
    viewBox="0 0 450 150"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{
      backgroundColor: "#ffffff",
    }}
  >
    <rect x="0" y="0" rx="3" ry="3" width="100" height="21" />
    <rect x="0" y="55" rx="3" ry="3" width="50" height="16" />
    <rect x="350" y="55" rx="3" ry="3" width="40" height="16" />
    <rect x="0" y="85" rx="3" ry="3" width="440" height="10" />
    <rect x="0" y="105" rx="3" ry="3" width="50" height="16" />

    <rect x="0" y="150" rx="3" ry="3" width="124" height="36" />
    <rect x="140" y="150" rx="3" ry="3" width="124" height="36" />
  </ContentLoader>
);

export default Loader;
