import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { postReissueTask } from "../../redux/actions/sign";
import { postAdminReissueTask } from "../../redux/actions/admin";

const ReissueTask = ({ code }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const { group_id, stage_id, task_id } = router.query;

  useEffect(() => {
    if (code && user.isFake) {
      dispatch(
        postReissueTask({
          code,
        }),
      );
    } else if (group_id && stage_id && task_id) {
      dispatch(
        postAdminReissueTask({
          group_id,
          stage_id,
          sign_task_id: task_id,
        }),
      );
    } else if (!group_id && stage_id && task_id) {
      dispatch(postReissueTask({ sign_task_id: task_id, stage_id }));
    }
  }, [code, group_id, stage_id, task_id, user, dispatch]);

  return null;
};

export default ReissueTask;
