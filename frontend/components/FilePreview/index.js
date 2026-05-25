import React from "react";
import { Wrapper, Img, ImgDefault } from "./styled";

const FilePreview = ({ thumbnail }) => {
  return (
    <Wrapper>
      {thumbnail ? <Img src={thumbnail} alt="file-preview" /> : <ImgDefault />}
    </Wrapper>
  );
};

export default FilePreview;
