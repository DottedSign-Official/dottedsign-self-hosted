import React from "react";
import ContentLoader from "react-content-loader";

const Loader = () => (
  <ContentLoader
    viewBox="0 0 155 116"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{
      width: "100%",
      padding: "10px",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
    }}
  >
    <circle cx="15" cy="30" r="10" />
    <rect x="50" y="20" rx="3" ry="3" width="80" height="5" />
    <rect x="50" y="30" rx="3" ry="3" width="70" height="5" />

    {[...Array(5)].map((_, idx) => (
      <rect
        key={idx}
        x="0"
        y={50 + 10 * idx}
        rx="3"
        ry="3"
        width="140"
        height="5"
      />
    ))}
  </ContentLoader>
);

export default Loader;
