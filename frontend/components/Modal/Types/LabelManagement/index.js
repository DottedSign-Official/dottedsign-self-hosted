import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";
import {
  manageLabel as manageLabelAction,
  getLabels,
} from "../../../../redux/actions/label";
import Icon from "../../../Icon";
import Button from "../../../Button";
import SelectLabels from "../../../../containers/SelectLabels";
import { DividerBtn } from "../../../../global/styled";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Content,
  Panel,
} from "../../../../global/styledModal";
import { WrapperBody, Hint } from "./styled";

const LabelManagement = ({
  onModalClose,
  data: { templateId, taskId, envelopeId, ids, labels, target },
}) => {
  const { t } = useTranslation("modal");
  const [myLabels, setMyLabels] = useState([]);
  const [addedTags, setAddedTags] = useState([]);
  const [removedTags, setRemovedTags] = useState([]);

  const isLoading = useSelector((state) => state.label.isLoading);
  const allLabels = useSelector((state) => state.label.labels);

  const dispatch = useDispatch();
  const manageLabel = (data) => dispatch(manageLabelAction(data));

  useEffect(() => {
    if (!allLabels) {
      dispatch(getLabels());
    }
  }, [allLabels, dispatch]);

  // NOTE: Convert the current file's labels into an array.
  useEffect(() => {
    if (labels) {
      let lbs = [];
      Object.keys(labels).forEach((key) => {
        if (labels[key]) {
          lbs.push(key);
        }
      });
      setMyLabels(lbs);
    }
  }, [labels]);

  const onUpdate = (operation, tag) => {
    if (operation === "add") {
      setRemovedTags((prev) => prev.filter((t) => t !== tag));
      setAddedTags((prev) => [...prev, tag]);
      setMyLabels((prev) => [...(prev || []), tag]);
    }
    if (operation === "delete") {
      setAddedTags((prev) => prev.filter((t) => t !== tag));
      setRemovedTags((prev) => [...prev, tag]);
      setMyLabels((prev) => prev.filter((t) => t !== tag));
    }
  };

  const onConfirm = () => {
    let taggable_type;
    let taggable_id;
    if (target === "template") {
      taggable_type = "Template";
      taggable_id = templateId;
    }
    if (target === "task") {
      taggable_type = envelopeId ? "Envelope" : "SignTask";
      taggable_id = envelopeId ? envelopeId : taskId;
    }
    if (target === "batch") {
      taggable_type = "Batch";
      taggable_id = ids;
    }

    // TYPE: { taggable_type: "SignTask" | "Template" | "Envelope" | "Batch" | "Member?" | "Group?" ;taggable_id: number | {envelope_id:[],task_id:[]} ; add_tags: array,remove_tags: array },

    manageLabel({
      taggable_type,
      taggable_id,
      add_tags: addedTags,
      remove_tags: removedTags,
    });
  };

  const isData = !allLabels?.length < 1;

  return (
    <Wrapper width="470px">
      <Close onClick={isLoading ? null : onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_label_management_title")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          <WrapperBody isData={isData}>
            {isData ? (
              <SelectLabels
                optionsActive={myLabels}
                onUpdate={onUpdate}
                target={target}
              />
            ) : (
              <Hint
                dangerouslySetInnerHTML={{
                  __html: t("modal_label_management_default"),
                }}
              />
            )}
          </WrapperBody>
        </Content>
      </Body>
      {isData && (
        <Panel>
          <Button
            type="cancel"
            handleEvent={isLoading ? () => {} : onModalClose}
          >
            {t("btn_cancel")}
          </Button>
          <DividerBtn />
          <Button
            type={isLoading ? "disabled" : "primaryFlex"}
            handleEvent={isLoading ? null : onConfirm}
          >
            {t("btn_confirm")}
          </Button>
        </Panel>
      )}
    </Wrapper>
  );
};

export default LabelManagement;
