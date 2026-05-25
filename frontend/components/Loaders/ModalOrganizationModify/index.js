import React from "react";
import ContentLoader from "react-content-loader";

const Loader = () => (
  <ContentLoader
    width={650}
    height={600}
    viewBox="0 0 650 600"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{
      width: "100%",
      padding: "15px 25px 40px",
    }}
  >
    <circle cx="12" cy="12" r="12" />
    <rect x="250" y="0" width="200" height="24" />

    <rect x="0" y="60" rx="3" ry="3" width="150" height="25" />
    <rect x="0" y="90" rx="3" ry="3" width="250" height="25" />

    <rect x="0" y="145" rx="3" ry="3" width="150" height="25" />
    <rect x="0" y="175" rx="3" ry="3" width="650" height="43" />

    <rect x="0" y="260" rx="3" ry="3" width="150" height="25" />
    <rect x="0" y="290" rx="3" ry="3" width="650" height="400" />
  </ContentLoader>
);

export default Loader;
