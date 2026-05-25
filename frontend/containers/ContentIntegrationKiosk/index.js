import React, { useEffect } from "react";
import uuid from "uuid/v1";
import { useSelector, useDispatch } from "react-redux";
import { postKioskCreate } from "../../redux/actions/create";
import { getSignTask, setTaskUuid } from "../../redux/actions/sign";
import Cover from "../../components/Cover";
import Content from "../../components/ContentKiosk";

const Integration = ({
  template_id,
  file_name,
  file_instructions,
  stages,
  inform_enable,
}) => {
  const { coverType } = useSelector((state) => state.common);
  const { task_id, download_link } = useSelector((state) => state.sign);
  const dispatch = useDispatch();

  const fileUrl = download_link;
  const title = file_name;

  useEffect(() => {
    dispatch(
      postKioskCreate({
        file_name,
        description: file_instructions,
        template_id,
        stages,
        inform_enable,
      }),
    );
  }, [
    file_name,
    file_instructions,
    inform_enable,
    stages,
    template_id,
    dispatch,
  ]);

  useEffect(() => {
    if (!task_id) {
      return;
    }

    dispatch(setTaskUuid(uuid()));
    dispatch(getSignTask({ taskId: task_id }));
  }, [task_id, dispatch]);

  if (coverType) {
    return <Cover type={coverType} isVisible />;
  }

  return (
    <Content taskId={task_id} fileUrl={fileUrl} title={title} stages={stages} />
  );
};

export default Integration;
