import PropTypes, { flowGraph } from "../../helpers/propTypes";

const propTypes = {
  tasksAdmin: PropTypes.arrayOf(
    PropTypes.shape({
      link: PropTypes.string.isRequired,
      expiresDays: PropTypes.number,
      thumbnail: PropTypes.string.isRequired,
      filename: PropTypes.string.isRequired,
      createdTime: PropTypes.string.isRequired,
      owner: PropTypes.string.isRequired,
      stages: PropTypes.arrayOf(flowGraph).isRequired,
    }),
  ),
};

export default propTypes;
