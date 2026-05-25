import React from "react";
import ContentLoader from "react-content-loader";

const Loader = ({ isLarge }) => {
  const radius = isLarge ? 48 : 32;
  const viewbox = `0 0 ${radius * 2} ${radius * 2}`;

  return (
    <ContentLoader
      width={radius * 2}
      height={radius * 2}
      viewBox={viewbox}
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      style={{
        padding: "8px",
      }}
    >
      <circle cx={`${radius}`} cy={`${radius}`} r={`${radius}`} />
    </ContentLoader>
  );
};

export default Loader;
