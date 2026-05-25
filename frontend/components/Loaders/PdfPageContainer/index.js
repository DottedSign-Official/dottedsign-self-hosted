import React from "react";
import ContentLoader from "react-content-loader";

const Loader = () => (
  <ContentLoader
    viewBox="0 0 800 1000"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{
      width: "100%",
      padding: "0 25px",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
    }}
  >
    <circle cx="95" cy="100" r="30" />
    <rect x="180" y="80" rx="3" ry="3" width="550" height="20" />
    <rect x="180" y="130" rx="3" ry="3" width="500" height="20" />

    {[...Array(15)].map((_, idx) => (
      <rect
        key={idx}
        x="80"
        y={160 + 40 * idx}
        rx="3"
        ry="3"
        width="640"
        height="20"
      />
    ))}
  </ContentLoader>
);

export default Loader;
