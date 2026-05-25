import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";
import { changeFileName as changeFileNameAction } from "../../../../redux/actions/sign";
import Icon from "../../../Icon";
import Button from "../../../Button";
import { DividerBtn } from "../../../../global/styled";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Content,
  Panel,
} from "../../../../global/styledModal";
import { Input } from "../../../../global/styledForm";
import { Text } from "./styled";

const FileRename = ({
  onModalClose,
  data: { taskId, filename, envelopeId, envelopeName },
}) => {
  const { t } = useTranslation("modal");

  const [name, setName] = useState("");
  const isLoading = useSelector((state) => state.sign.isLoading);
  const dispatch = useDispatch();
  const changeFileName = (data) => dispatch(changeFileNameAction(data));

  useEffect(() => {
    if (envelopeName) {
      setName(envelopeName);
    } else if (filename) {
      setName(filename);
    }
  }, [filename, envelopeName]);

  const onInputChange = (e) => {
    setName(e.target.value);
  };

  const onPutName = () => {
    changeFileName({
      ...(envelopeId ? { envelope_id: envelopeId } : { sign_task_id: taskId }),
      file_name: name,
    });
  };

  if (!(taskId || envelopeId)) {
    return null;
  }

  return (
    <Wrapper width="500px">
      <Close onClick={isLoading ? () => {} : onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>
        {t(envelopeId ? "modal_rename_envelope_title" : "modal_rename_title")}
      </Title>
      <Body id="modal-body-scrollable">
        <Content>
          <Text>
            {t(
              envelopeId
                ? "modal_rename_envelope_content"
                : "modal_rename_content",
            )}
          </Text>
          <Input value={name} onChange={onInputChange} />
        </Content>
      </Body>
      <Panel>
        <Button type="cancel" handleEvent={isLoading ? () => {} : onModalClose}>
          {t("btn_cancel")}
        </Button>
        <DividerBtn />
        <Button type="primaryFlex" handleEvent={isLoading ? null : onPutName}>
          {t("btn_rename")}
        </Button>
      </Panel>
    </Wrapper>
  );
};

export default FileRename;
