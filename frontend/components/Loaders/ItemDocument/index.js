import React from "react";
import ContentLoader from "react-content-loader";

const Loader = () => (
  <ContentLoader
    width={822}
    height={43}
    viewBox="0 0 822 43"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{
      width: "100%",
      borderRadius: "4px",
    }}
  >
    <rect x="0" y="0" rx="3" ry="3" width="250" height="20" />
    <rect x="0" y="25" rx="3" ry="3" width="100" height="20" />
  </ContentLoader>
);

export default Loader;
