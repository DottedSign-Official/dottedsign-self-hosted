import React from "react";
import { signToBase64Src } from "../../helpers/base64";
import { isExist } from "../../helpers/others";
import { uploadFieldStyle } from "../../constants/constants";
import Dropzone from "../../containers/Dropzone";
import Loader from "../Loaders/Stamp";
import Icon from "../Icon";
import {
  Wrapper,
  Item,
  StampWrapper,
  Stamp,
  Del,
  UploadWrapper,
  Text,
} from "./styled";

const MyStamps = ({
  isLoading,
  myStamps,
  activeItem,
  onSignSave,
  onSignDelete,
  onSignSelect,
  onSignBlur,
  onCreateStamp,
  t,
}) => {
  if (!isExist(myStamps) || isLoading) {
    return (
      <Wrapper>
        {[...Array(3)].map((_, idx) => (
          <Loader key={idx} />
        ))}
      </Wrapper>
    );
  }

  return (
    <Wrapper tabIndex="55662" onBlur={onSignBlur}>
      {myStamps &&
        myStamps.map((stamp, idx) => (
          <Item key={idx}>
            <StampWrapper
              isActive={activeItem && stamp.id === activeItem.id}
              onClick={() => onSignSelect(stamp)}
            >
              <Stamp src={signToBase64Src(stamp)} />
            </StampWrapper>
            {activeItem && stamp.id === activeItem.id && (
              <>
                <Del onClick={() => onSignDelete(stamp.id)}>
                  <Icon type="close" size="18px" />
                </Del>
              </>
            )}
          </Item>
        ))}
      <Item>
        <StampWrapper>
          <UploadWrapper>
            <Dropzone
              id={"Stamp-upload"}
              type={uploadFieldStyle.textOnly}
              allowedFormat={"image"}
              setFiles={onSignSave}
            />
          </UploadWrapper>
        </StampWrapper>
      </Item>
      <Item>
        <StampWrapper>
          <UploadWrapper onClick={onCreateStamp}>
            <Text>{t("create_stamp")}</Text>
          </UploadWrapper>
        </StampWrapper>
      </Item>
    </Wrapper>
  );
};

export default MyStamps;
