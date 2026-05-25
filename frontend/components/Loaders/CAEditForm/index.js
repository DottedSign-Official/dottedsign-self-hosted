import React from "react";
import ContentLoader from "react-content-loader";

const Loader = () => (
  <ContentLoader
    width="100%"
    height={469}
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{
      backgroundColor: "#ffffff",
    }}
  >
    <rect x="0" y="0" rx="3" ry="3" width="20%" height="20" />
    <rect x="0" y="28" rx="3" ry="3" width="100%" height="44" />
    <rect x="0" y="88" rx="3" ry="3" width="20%" height="20" />
    <rect x="0" y="116" rx="3" ry="3" width="100%" height="44" />
    <rect x="0" y="176" rx="3" ry="3" width="20%" height="20" />
    <rect x="0" y="212" rx="3" ry="3" width="100%" height="44" />
    <rect x="0" y="272" rx="3" ry="3" width="20%" height="20" />
    <rect x="0" y="300" rx="3" ry="3" width="100%" height="44" />
    <rect x="0" y="360" rx="3" ry="3" width="20%" height="20" />
    <rect x="0" y="388" rx="3" ry="3" width="10%" height="20" />
  </ContentLoader>
);

export default Loader;
