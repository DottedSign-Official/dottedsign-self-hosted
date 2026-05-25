import React from "react";
import ContentLoader from "react-content-loader";

const Loader = () => (
  <ContentLoader
    width={894}
    height={418}
    viewBox="0 0 894 418"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{
      width: "100%",
      padding: "30px 70px",
      border: "1px solid #ecebeb",
    }}
  >
    <rect x="392" y="60" rx="3" ry="3" width="110" height="36" />
    <rect x="372" y="120" rx="3" ry="3" width="150" height="24" />

    <rect x="80" y="200" rx="3" ry="3" width="700" height="10" />

    <rect x="392" y="260" rx="3" ry="3" width="110" height="36" />
  </ContentLoader>
);

export default Loader;
