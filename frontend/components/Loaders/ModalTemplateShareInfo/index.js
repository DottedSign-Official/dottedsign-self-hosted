import React from "react";
import ContentLoader from "react-content-loader";

const Loader = () => (
  <ContentLoader
    width={470}
    height={300}
    viewBox="0 0 470 280"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{
      width: "100%",
      padding: "15px 25px",
    }}
  >
    <rect x="0" y="0" width="100%" height="40" />

    <rect x="0" y="80" rx="3" ry="3" width="24" height="24" />
    <rect x="40" y="80" rx="3" ry="3" width="200" height="24" />

    <rect x="0" y="120" rx="3" ry="3" width="24" height="24" />
    <rect x="40" y="120" rx="3" ry="3" width="200" height="24" />

    <rect x="0" y="160" rx="3" ry="3" width="24" height="24" />
    <rect x="40" y="160" rx="3" ry="3" width="200" height="24" />

    <rect x="350" y="240" width="50" height="30" />
    <rect x="420" y="240" width="50" height="30" />
  </ContentLoader>
);

export default Loader;
