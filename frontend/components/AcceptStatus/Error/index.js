import Cover from "../../../components/Cover";

const Error = ({ status }) => {
  return <Cover isVisible type={status} />;
};

export default Error;
