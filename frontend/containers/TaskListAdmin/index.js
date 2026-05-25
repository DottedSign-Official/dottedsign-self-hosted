import React, { useEffect, useCallback } from "react";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import {
  getTasksAdmin,
  setFocusGroup as setFocusGroupAction,
  setPageCurrent as setPageCurrentAction,
} from "../../redux/actions/admin";
import TaskStatus from "../../components/TaskStatusBarAdmin";
import TaskListAdminComponent from "../../components/TaskListAdmin";
import Pagination from "../../components/Pagination";
import { Block, Label, BlockContent } from "../../global/styledAdmin";

const TaskListAdmin = () => {
  const { t } = useTranslation("admin");

  const { focusGroup, tasksSummaryAdmin, tasksAdmin, pageCurrent, pageTotal } =
    useSelector((state) => state.admin);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const setPageCurrent = (data) => dispatch(setPageCurrentAction(data));
  const setFocusGroup = useCallback(
    (data) => dispatch(setFocusGroupAction(data)),
    [dispatch],
  );
  const onPageChange = (pg) => setPageCurrent(pg);

  useEffect(() => {
    dispatch(getTasksAdmin());
  }, [focusGroup, dispatch]);

  useEffect(() => {
    if (!focusGroup && tasksSummaryAdmin?.length > 0) {
      setFocusGroup(tasksSummaryAdmin[0].key);
    }
  }, [focusGroup, tasksSummaryAdmin, setFocusGroup]);

  const onNav = (task) => {
    const rollbackSigner = task.stages?.find(
      (el) => el.status === "processing_file_failed",
    );

    if (!rollbackSigner) {
      return router.push(task.link);
    }
    router.push({
      pathname: "/reissue",
      query: {
        task_id: task.task_id,
        stage_id: rollbackSigner.id,
        group_id: user.group_id,
      },
    });
  };

  return (
    <Block width="100%">
      <Label>{t("label_task_list")}</Label>
      <BlockContent>
        {tasksSummaryAdmin && (
          <TaskStatus
            focusGroup={focusGroup}
            tasksSummaryAdmin={tasksSummaryAdmin}
            onTabClick={setFocusGroup}
          />
        )}
        <TaskListAdminComponent tasksAdmin={tasksAdmin} onNav={onNav} />
        <br />
        <Pagination
          pages={pageTotal}
          page={pageCurrent}
          onTabClick={onPageChange}
        />
      </BlockContent>
    </Block>
  );
};

export default TaskListAdmin;
