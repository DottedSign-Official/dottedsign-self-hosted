import { withMiddleware } from "../../helpers/apiHelper";
import { parseTaskToPreview } from "./helpers/tasks";

export const getTasksAdmin = (invokeApi) => {
  const CATEGORY = {
    PENDING: "PENDING",
    WAITING: "WAITING",
    COMPLETED: "COMPLETED",
    FAILED: "FAILED",
  };
  const requestParser = ({
    groupID,
    focusMembers,
    focusGroup,
    pageCurrent,
    dateStart,
    dateEnd,
  }) => {
    const categoryKeys = {
      [CATEGORY.PENDING]: "waiting_for_group",
      [CATEGORY.WAITING]: "waiting_for_other_groups",
      [CATEGORY.COMPLETED]: "group_completed",
      [CATEGORY.FAILED]: "processing_file_failed_for_group",
    };

    let data = {
      group_id: groupID,
      emails: focusMembers,
      category: categoryKeys[focusGroup],
      page: pageCurrent,
    };

    if (dateStart) {
      data.start_from = dateStart.format("YYYY/MM/DD");
    }
    if (dateEnd) {
      data.end_at = dateEnd.format("YYYY/MM/DD");
    }

    return data;
  };
  const tasksResponseParser = (response) => {
    if (!response || !response.data) {
      return;
    }
    const { data } = response;

    const {
      summary: {
        waiting_for_group,
        waiting_for_other_groups,
        group_completed,
        processing_file_failed_for_group,
      },
      total_pages,
      tasks,
    } = data;

    return {
      data: {
        summary: [
          {
            key: CATEGORY.PENDING,
            count: waiting_for_group,
            text: "tab_group_waiting",
          },
          {
            key: CATEGORY.WAITING,
            count: waiting_for_other_groups,
            text: "tab_group_waiting_others",
          },
          {
            key: CATEGORY.COMPLETED,
            count: group_completed,
            text: "tab_group_completed",
          },
          {
            key: CATEGORY.FAILED,
            count: processing_file_failed_for_group,
            text: "tab_group_failed",
          },
        ],
        pageTotal: total_pages,
        tasks: tasks.map(parseTaskToPreview),
      },
    };
  };
  return withMiddleware(invokeApi, requestParser, tasksResponseParser);
};
