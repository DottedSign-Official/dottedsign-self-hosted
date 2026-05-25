import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";
import Icon from "../../../Icon";
import { DividerBtn } from "../../../../global/styled";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Content,
  Panel,
} from "../../../../global/styledModal";
import InputField from "./InputField";
import { useSelector } from "react-redux";
import ButtonWithLoading from "../../../ButtonWithLoading";
import TextStampGenerator from "../../../TextStampCanvas";
import Select from "../../../../containers/Select";
import { getStyleSelections, styles } from "./data";
import { Image, ImageWrapper, Text } from "./styled";

const StampCreator = ({ onModalClose, data }) => {
  const { onSubmit, text: dataText, style: dataStyle } = data;
  const { t } = useTranslation("settings");
  const selections = getStyleSelections(t);
  const { isLoading } = useSelector((state) => state.sign);
  const [text, setText] = useState(dataText || "");
  const [style, setStyle] = useState(dataStyle || Object.keys(styles)[0]);
  const [dataURL, setDataURL] = useState("");
  const dispatch = useDispatch();

  const onSave = () => {
    onSubmit(dataURL, dispatch);
  };

  const onLayoutChange = (obj) => {
    setStyle(obj.key);
  };

  const canSubmit = text.trim();
  return (
    <Wrapper>
      <Close onClick={onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("create_stamp_title")}</Title>
      <Body>
        <Content>
          <Text>{t("create_stamp_text")}</Text>
          <InputField defaultValue={text} callbackValue={setText} />
          <Text>{t("create_stamp_style")}</Text>
          <Select
            activeItem={selections.find((obj) => obj.key === style)}
            items={selections}
            indexText={"text"}
            onSelectEvent={onLayoutChange}
          />
          <Text>{t("create_stamp_preview")}</Text>

          <ImageWrapper>
            <Image src={dataURL} alt={""} />
            <TextStampGenerator
              text={text}
              onRender={setDataURL}
              {...styles[style]}
            />
          </ImageWrapper>
        </Content>
      </Body>
      <Panel>
        <ButtonWithLoading
          type="cancel"
          handleEvent={onModalClose}
          isLoading={isLoading}
        >
          {t("cancel")}
        </ButtonWithLoading>
        <DividerBtn />
        <ButtonWithLoading
          type={canSubmit ? "primary" : "disabled"}
          isLoading={isLoading}
          handleEvent={canSubmit ? onSave : null}
        >
          {t("save")}
        </ButtonWithLoading>
      </Panel>
    </Wrapper>
  );
};

export default StampCreator;
