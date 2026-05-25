import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { TASK_STATUS_TEXT, MODAL_TYPE } from "../../../constants/constants";
import { unixToString } from "../../../helpers/time";
import { parseTaskToMoreMenu } from "../../../apis/middleware/helpers/tasks";
import LoaderLabel from "../../Loaders/LabelSearch";
import Loader from "../../Loaders/TaskItemSearch";
import Blank from "../../Blank";
import FilePreview from "../../FilePreview";
import TagCounter from "../../TagCounter";
import MoreIcon from "../../../containers/More";
import Checkbox from "../../Checkbox";
import Icon from "../../Icon";
import {
  Wrapper,
  Count,
  WrapperItems,
  Item,
  Preview,
  Text,
  Name,
  Time,
  User,
  More,
  MoreIconDiv,
  WrapperCheck,
  CheckAllItem,
  EditItem,
  Check,
  WrapperEnvelopeIcon,
} from "./styled";

const Items = ({ isMobile, isPlaceholder, onModalOpen, onManageLabel }) => {
  const { t } = useTranslation("common");
  const Router = useRouter();
  const { currentSigner, currentTab, totalTasks, tasksSearch, isLoading } =
    useSelector((state) => state.search);
  const [isChecked, setIsChecked] = useState(false);
  const [checkedId, setId] = useState({ task_ids: [], envelope_ids: [] });

  useEffect(() => {
    if (isLoading) {
      setIsChecked(false);
      setId({ task_ids: [], envelope_ids: [] });
    }
  }, [isLoading]);

  const isTaskChecked = (taskId, envelopeId) =>
    checkedId.task_ids.filter((id) => id === taskId).length > 0 ||
    checkedId.envelope_ids.filter((id) => id === envelopeId).length > 0;
  const isAnyTaskChecked =
    checkedId.task_ids.length > 0 || checkedId.envelope_ids.length > 0;

  if (isPlaceholder) {
    return (
      <Wrapper>
        <LoaderLabel />
        {[...Array(8)].map((_, idx) => (
          <Loader key={idx} />
        ))}
      </Wrapper>
    );
  }

  if (tasksSearch.length < 1) {
    if (currentTab === "signer") {
      return <Blank type="searchSigner" />;
    }

    return <Blank type="searchDocument" />;
  }

  const userText = (task) => {
    const textCommon = `${task.stage_infos.length} ${t("users_in_use")}`;

    if (currentTab === "document" || currentTab === "envelope") {
      return textCommon;
    }

    if (!currentSigner || currentSigner === "") {
      return null;
    }

    const user = task.stage_infos.find(
      (stage) =>
        stage.name.indexOf(currentSigner) !== -1 ||
        stage.email?.indexOf(currentSigner) !== -1,
    );

    if (user) {
      return `<span>${user.name}</span>, ${textCommon}`;
    }
  };

  const onNav = (task) => {
    const path = task.envelope_id
      ? `/task?envelopeId=${task.envelope_id}`
      : `/task?taskId=${task.task_id}`;
    Router.push(path);
  };

  const onAllToggle = () => {
    setIsChecked(!isChecked);

    if (isChecked) {
      return setId({ task_ids: [], envelope_ids: [] });
    }

    let selected = { ...checkedId };
    tasksSearch.map((task) => {
      if (task.task_id) {
        selected.task_ids.push(task.task_id);
      } else if (task.envelope_id) {
        selected.envelope_ids.push(task.envelope_id);
      }
    });
    setId(selected);
  };

  const onTaskToggle = (taskId, envelopeId) => {
    const selected = { ...checkedId };

    const isChecked = isTaskChecked(taskId, envelopeId);
    const hasTaskId = Boolean(taskId);
    const hasEnvelopeId = Boolean(envelopeId);

    if (isChecked) {
      if (hasTaskId) {
        selected.task_ids = selected.task_ids.filter((id) => id !== taskId);
      }
      if (hasEnvelopeId) {
        selected.envelope_ids = selected.envelope_ids.filter(
          (id) => id !== envelopeId,
        );
      }
    } else {
      if (hasTaskId) {
        selected.task_ids.push(taskId);
      }
      if (hasEnvelopeId) {
        selected.envelope_ids.push(envelopeId);
      }
    }
    setId(selected);

    // NOTE: Check if all tasks are selected
    const totalSelected =
      selected.task_ids.length + selected.envelope_ids.length;
    const allSelected = totalSelected === tasksSearch.length;
    setIsChecked(allSelected);
  };

  return (
    <Wrapper>
      <Count>{`${t("search_results")} (${totalTasks})`}</Count>
      <WrapperCheck>
        <CheckAllItem onClick={onAllToggle}>
          <Checkbox isChecked={isChecked} />
          <span>{t("select_all")}</span>
        </CheckAllItem>
        {isAnyTaskChecked && (
          <EditItem onClick={() => onManageLabel({ checkedIds: checkedId })}>
            <Icon type="tag" />
            <span>{t("label_management")}</span>
          </EditItem>
        )}
      </WrapperCheck>
      <WrapperItems>
        {tasksSearch.map((task, idx) => {
          const moreMenu = parseTaskToMoreMenu(task).moreMenu;
          const signerStatusData = moreMenu.signerStatus.data;
          return (
            <Item key={idx}>
              <Check>
                <Checkbox
                  isChecked={isTaskChecked(task.task_id, task.envelope_id)}
                  onToggle={() => onTaskToggle(task.task_id, task.envelope_id)}
                />
              </Check>
              <Preview>
                {task.thumbnail && (
                  <FilePreview
                    thumbnail={
                      task.thumbnail.completed || task.thumbnail.original
                    }
                  />
                )}
              </Preview>
              <Text onClick={() => onNav(task)}>
                <Name
                  dangerouslySetInnerHTML={{
                    __html: task.file_name || task.envelope_name,
                  }}
                />
                <Time>{`${unixToString(task.modified_at, null, false)}`}</Time>
                <User dangerouslySetInnerHTML={{ __html: userText(task) }} />
                <TagCounter tag_info={task.tag_info} />
              </Text>
              <More
                onClick={() =>
                  onModalOpen({
                    modalType: MODAL_TYPE.fileInfo,
                    modalData: {
                      tabType: "signer_status",
                      data: signerStatusData,
                    },
                  })
                }
              >
                {t(TASK_STATUS_TEXT[task.status])}
              </More>
              {!isMobile && (
                <MoreIconDiv>
                  <MoreIcon menu={moreMenu} />
                </MoreIconDiv>
              )}
              {task.envelope_id && (
                <WrapperEnvelopeIcon>
                  <Icon type="envelope" size="28px" />
                </WrapperEnvelopeIcon>
              )}
            </Item>
          );
        })}
      </WrapperItems>
    </Wrapper>
  );
};

export default Items;
