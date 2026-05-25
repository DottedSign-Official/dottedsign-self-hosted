import React from "react";
import ContentLoader from "react-content-loader";

const Loader = ({ isInit, isMobile }) => {
  if (isInit) {
    return (
      <ContentLoader
        viewBox="0 0 1280 50"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        style={{
          width: "100%",
          backgroundColor: "#ffffff",
        }}
      />
    );
  }

  if (isMobile) {
    return (
      <ContentLoader
        viewBox="0 0 375 48"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        style={{
          width: "100%",
          backgroundColor: "#ffffff",
        }}
      >
        <rect x="15" y="15" width="345" height="18" />
      </ContentLoader>
    );
  }

  return (
    <ContentLoader
      viewBox="0 0 628 88"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      style={{
        width: "628px",
        height: "88px",
        backgroundColor: "#ffffff",
      }}
    >
      <circle cx="50" cy="40" r="18" />
      <rect x="0" y="65" width="100" height="12" />

      <circle cx="182" cy="40" r="18" />
      <rect x="132" y="65" width="100" height="12" />

      <circle cx="314" cy="40" r="18" />
      <rect x="264" y="65" width="100" height="12" />

      <circle cx="446" cy="40" r="18" />
      <rect x="396" y="65" width="100" height="12" />

      <circle cx="578" cy="40" r="18" />
      <rect x="528" y="65" width="100" height="12" />
    </ContentLoader>
  );
};

export default Loader;
