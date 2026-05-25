import React from "react";
import ContentLoader from "react-content-loader";

const Loader = () => (
  <ContentLoader
    width={288}
    height={220}
    viewBox="0 0 288 220"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{
      margin: "8px",
      padding: "10px",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
    }}
  >
    <rect x="0" y="0" rx="3" ry="3" width="50" height="70" />
    <rect x="60" y="20" rx="3" ry="3" width="88" height="6" />
    <rect x="60" y="40" rx="3" ry="3" width="52" height="6" />
    <rect x="0" y="90" width="260" height="3" />

    <rect x="0" y="120" width="40" height="5" />
    <circle cx="20" cy="150" r="20" />
    <rect x="0" y="180" width="40" height="5" />

    <rect x="50" y="150" width="140" height="5" />

    <rect x="200" y="120" width="40" height="5" />
    <circle cx="220" cy="150" r="20" />
    <rect x="200" y="180" width="40" height="5" />
  </ContentLoader>
);

export default Loader;
