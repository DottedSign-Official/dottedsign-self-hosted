import React, { useState } from "react";
import { uploadFieldStyle } from "../../constants/constants";
import Dropzone from "../../containers/Dropzone";
import Avatar from "../../components/Avatar";

import {
  Wrapper,
  AvatarActive,
  WrapperAvatarMy,
  WrapperUpload,
} from "./styled";

const SettingAvatar = ({ onFileChange, iconURL }) => {
  const [imageURL, setImageURL] = useState(iconURL);

  const onUpload = (file) => {
    setImageURL(file[0].preview);
    onFileChange(file);
  };

  return (
    <Wrapper>
      <AvatarActive>
        <WrapperAvatarMy>
          <Avatar width="96px" src={imageURL} />
        </WrapperAvatarMy>
        <WrapperUpload>
          <Dropzone
            type={uploadFieldStyle.textOnly}
            allowedFormat={"image"}
            setFiles={onUpload}
          />
        </WrapperUpload>
      </AvatarActive>
    </Wrapper>
  );
};

export default SettingAvatar;
