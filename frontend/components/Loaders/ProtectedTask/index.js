import React from "react";
import ContentLoader from "react-content-loader";

const Loader = () => (
  <ContentLoader
    viewBox="0 0 1040 860"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{
      width: "100%",
      backgroundColor: "#ffffff",
    }}
  >
    <rect x="0" y="0" rx="3" ry="3" width="200" height="27" />

    <rect x="0" y="50" rx="3" ry="3" width="100" height="16" />
    <rect x="0" y="90" rx="3" ry="3" width="150" height="16" />
    <rect x="310" y="90" rx="12" ry="12" width="50" height="24" />

    <rect x="0" y="165" rx="3" ry="3" width="100" height="16" />

    <rect x="0" y="205" rx="3" ry="3" width="950" height="30" />
    <rect x="0" y="240" rx="3" ry="3" width="950" height="50" />
    <rect x="0" y="295" rx="3" ry="3" width="950" height="50" />
    <rect x="0" y="350" rx="3" ry="3" width="950" height="50" />
    <rect x="0" y="405" rx="3" ry="3" width="950" height="50" />
    <rect x="0" y="460" rx="3" ry="3" width="950" height="50" />
  </ContentLoader>
);

export default Loader;
