import React from "react";
import ContentLoader from "react-content-loader";

const Loader = () => (
  <ContentLoader
    viewBox="0 0 1400 100"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{
      width: "100%",
      marginBottom: "1px",
      padding: "20px 40px",
      backgroundColor: "#ffffff",
    }}
  >
    <rect x="0" y="10" width="70" height="80" rx="4" />

    <rect x="90" y="15" width="280" height="18" rx="4" />
    <rect x="90" y="42" width="60" height="14" rx="3" />
    <rect x="90" y="65" width="80" height="12" rx="3" />

    <rect x="500" y="35" width="150" height="16" rx="4" />

    <circle cx="770" cy="43" r="20" />
    <circle cx="810" cy="43" r="20" />
    <circle cx="850" cy="43" r="20" />
    <circle cx="890" cy="43" r="20" />

    <rect x="1050" y="37" width="180" height="14" rx="3" />

    <circle cx="1360" cy="43" r="4" />
    <circle cx="1373" cy="43" r="4" />
    <circle cx="1386" cy="43" r="4" />
  </ContentLoader>
);

export default Loader;
