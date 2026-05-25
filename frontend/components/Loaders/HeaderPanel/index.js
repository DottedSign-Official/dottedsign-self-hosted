import React from "react";
import ContentLoader from "react-content-loader";

const Loader = () => (
  <ContentLoader
    width={310}
    height={28}
    viewBox="0 0 310 28"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{
      borderRadius: "8px",
    }}
  >
    <circle cx="12" cy="14" r="12" />
    <rect x="32" y="6" width="50" height="16" />

    <circle cx="115" cy="14" r="12" />
    <rect x="135" y="6" width="50" height="16" />

    <circle cx="217" cy="14" r="12" />
    <rect x="237" y="6" width="50" height="16" />
  </ContentLoader>
);

export default Loader;
