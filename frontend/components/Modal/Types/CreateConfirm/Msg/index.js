import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "next-i18next";
import { Textarea } from "../../../../../global/styledForm";
import { filterSignerAssignes } from "../../../../../helpers/assignees/review";
import SelectMulti from "../../../../../containers/SelectMulti";
import Reference from "./Reference";
import { Wrapper, Tabs, Tab, Body, Label } from "./styled";

const Message = ({
  assignes,
  isReadOnly,
  message,
  completedMessage,
  references,
  completedReferences,
  onSettingChange,
  msgRequestReceivers,
  msgCompletedReceivers,
}) => {
  const [candidates, setCandidates] = useState([]);
  const [labelFocus, setLabelFocus] = useState("request");
  const { t } = useTranslation("modal");
  const refLabel = useRef();

  useEffect(() => {
    // NOTE: reconstruct the receivers when assignes changed
    // NOTE: do NOT use parameters monitor directly to avoid infinite loop
    if (assignes) {
      const filteredAssignes = filterSignerAssignes(assignes);
      let uids = [];
      let cands = [];

      filteredAssignes.map((ass) => {
        if (ass.role) {
          cands.push({
            ...ass,
            fullName: ass.role,
          });
          return;
        }

        if (ass.uid && !uids.includes(ass.uid)) {
          uids.push(ass.uid);
          cands.push({
            ...ass,
            fullName: `${ass.name} (${ass.email})`,
          });
          return;
        }
      });

      setCandidates(cands);
    }
  }, [assignes]);

  const onChange = (e) => {
    const val = e.target.value;
    if (labelFocus === "request") {
      onSettingChange({
        message: val,
      });
    } else {
      onSettingChange({
        completedMessage: val,
      });
    }
  };

  const onLabelChange = (label) => {
    setLabelFocus(label);
    refLabel.current = label;
  };

  const onReceiverChanged = (operation, itm) => {
    const isRequest = labelFocus === "request";
    const itms = isRequest ? msgRequestReceivers : msgCompletedReceivers;

    const updatedItms =
      operation === "add"
        ? [...(itms || []), itm]
        : operation === "delete"
        ? itms.filter((t) => t !== itm)
        : itms;

    onSettingChange({
      [isRequest ? "msgRequestReceivers" : "msgCompletedReceivers"]:
        updatedItms,
    });
  };

  const onReferenceChanged = (refs) => {
    if (refLabel.current === "completed") {
      const refsMan = refs.map((ref) => {
        if (!ref.fileId.includes("completed_reference_")) {
          return {
            ...ref,
            fileId: `completed_reference_${ref.fileId}`,
          };
        }

        return ref;
      });
      onSettingChange({
        completedReferences: refsMan,
      });
      return;
    }

    const refsMan = refs.map((ref) => {
      if (!ref.fileId.includes("reference_")) {
        return {
          ...ref,
          fileId: `reference_${ref.fileId}`,
        };
      }

      return ref;
    });
    onSettingChange({
      references: refsMan,
    });
    return;
  };

  return (
    <Wrapper>
      <Tabs>
        <Tab
          isFocus={labelFocus === "request"}
          onClick={() => onLabelChange("request")}
        >
          {t("reference_label_request")}
        </Tab>
        <Tab
          isFocus={labelFocus === "completed"}
          onClick={() => onLabelChange("completed")}
        >
          {t("reference_label_completed")}
        </Tab>
      </Tabs>
      <Body>
        <Label>{t("label_receivers")}</Label>
        <SelectMulti
          options={candidates}
          optionsActive={
            labelFocus === "request"
              ? msgRequestReceivers
              : msgCompletedReceivers
          }
          objKey="email"
          objText="fullName"
          placeholder="to"
          onUpdate={onReceiverChanged}
          isReadOnly={isReadOnly}
        />
        <br />
        <Label>{t("label_receivers_msg")}</Label>
        <Textarea
          rows="5"
          value={(labelFocus === "request" ? message : completedMessage) || ""}
          tabIndex="5566"
          onChange={onChange}
          placeholder={t("msg_placeholder")}
          readOnly={isReadOnly}
        />
        <br />
        <Label>{t("label_reference")}</Label>
        <Reference
          isReadOnly={isReadOnly}
          references={
            labelFocus == "request" ? references : completedReferences
          }
          onChanged={onReferenceChanged}
        />
      </Body>
    </Wrapper>
  );
};

export default Message;
