import React from "react";
import More from "../More";
import { Wrapper, FileName, Text, MoreWrapper } from "./styled";

const Content = ({ title, text }) => {
  if (!text) {
    return null;
  }
  return <Text>{`${title}: ${text}`}</Text>;
};

const Block = ({ task, onNav, items }) => {
  return (
    <Wrapper onClick={onNav}>
      {items?.length > 0 && (
        <MoreWrapper>
          <More items={items} />
        </MoreWrapper>
      )}
      <FileName>{task.file_name}</FileName>
      <Content title={"task_id"} text={task.id} />
      <Content title={"status"} text={task.status} />
      <Content title={"owner"} text={task.owner} />
      <Content title={"created_at"} text={task.created_at} />
      <Content title={"ca_status"} text={task.ca_status} />
    </Wrapper>
  );
};

const Grid = ({ tasks, onClick, getMenu }) => {
  return tasks.map((task, idx) => (
    <Block
      key={idx}
      task={task}
      onNav={() => onClick(task.id)}
      items={getMenu(task)}
    />
  ));
};

export default Grid;
