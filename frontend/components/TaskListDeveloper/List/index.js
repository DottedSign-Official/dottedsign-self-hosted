import Table from "../../Table";
import { ListWrapper } from "./styled";
import More from "../More";

const columns = {
  id: {
    getContent: (task) => task?.id,
    text: "id",
    weight: 2,
  },
  file_name: {
    getContent: (task) => task?.file_name,
    text: "file_name",
    weight: 3,
  },
  status: {
    getContent: (task) => task?.status,
    text: "status",
    weight: 2,
  },
  created_at: {
    getContent: (task) => task?.created_at,
    text: "created_at",
    weight: 4,
  },
  owner: {
    getContent: (task) => task?.owner,
    text: "owner",
    weight: 4,
  },
  viewable: {
    getContent: (task) => task?.viewable?.toString(),
    text: "viewable",
    weight: 2,
  },
  ca_status: {
    getContent: (task) => task?.ca_status,
    text: "ca_status",
    weight: 2,
  },
  menu: {
    getContent: (task, getMenu) => {
      return <More items={getMenu(task)} />;
    },
    text: "",
    weight: 1,
  },
};

const List = ({ tasks, onClick, getMenu }) => {
  const titles = {};

  const data = tasks.map((task) => {
    const row = [];
    Object.keys(columns).forEach((key) => {
      const { getContent } = columns[key];

      const content = getContent(task, getMenu);
      if (content) {
        titles[key] = columns[key];
        row.push(content);
      }
    });

    return row;
  });

  const title = Object.keys(titles).map((key) => titles[key].text);
  const weights = Object.keys(titles).map((key) => titles[key].weight);
  const sum = weights.reduce((a, b) => a + b, 0);
  const widths = weights.map((value) => `${(value / sum) * 100}%`);
  const dataWithTitle = [title, ...data];

  const handleClick = ([id]) => {
    onClick(id);
  };
  return (
    <>
      <ListWrapper>
        <Table data={dataWithTitle} widths={widths} onClick={handleClick} />
      </ListWrapper>
    </>
  );
};

export default List;
