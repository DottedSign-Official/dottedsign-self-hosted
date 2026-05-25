import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ThumbnailTemplate from "../../components/ThumbnailTemplate";

const ThumbnailTemplateContainer = () => {
  const [myName, setMyName] = useState(null);
  const thumbnail = useSelector((state) => state.create.thumbnail);
  const fileName = useSelector((state) => state.create.fileName);

  useEffect(() => {
    if (fileName && !myName) {
      setMyName(fileName);
    }
  }, [fileName, myName]);

  return <ThumbnailTemplate thumbnail={thumbnail} name={myName} />;
};

export default ThumbnailTemplateContainer;
