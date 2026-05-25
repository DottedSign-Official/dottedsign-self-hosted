import React from "react";
import ContentLoader from "react-content-loader";

const Loader = () => (
  <ContentLoader
    width={1080}
    height={300}
    viewBox="0 0 1080 300"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{
      width: "100%",
      backgroundColor: "#ffffff",
    }}
  >
    <rect x="0" y="0" rx="3" ry="3" width="1080" height="60" />
    <rect x="0" y="65" rx="3" ry="3" width="1080" height="60" />
    <rect x="0" y="130" rx="3" ry="3" width="1080" height="60" />
  </ContentLoader>
);

export default Loader;
