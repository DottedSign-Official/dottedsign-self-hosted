import React from "react";
import ContentLoader from "react-content-loader";

const ListItem = ({ count = 1 }) => {
  const itemArray = [...Array(count).keys()];
  return (
    <>
      {itemArray.map((_, index) => (
        <ContentLoader
          key={index}
          width={1080}
          height={60}
          viewBox="0 0 1080 60"
          backgroundColor={index % 2 === 0 ? "#fcfcfc" : "#f3f3f3"}
          foregroundColor="#ecebeb"
          style={{
            width: "100%",
            backgroundColor: "#ffffff",
          }}
        >
          <rect x="0" y="0" rx="3" ry="3" width="1080" height="60" />
        </ContentLoader>
      ))}
    </>
  );
};

export default ListItem;
