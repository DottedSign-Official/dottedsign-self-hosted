import React from "react";
import dataset from "./data";
import Button from "../Button";
import { DownloadImg } from "./styled";

const Badge = ({ platform, id }) => {
  const data = dataset[platform];

  if (!data) {
    return null;
  }
  return (
    <Button id={id} type="singleImg" url={data.url} target="_blank">
      <DownloadImg src={data.imgSrc} alt={data.imgAlt} />
    </Button>
  );
};

export default Badge;
