import React from "react";
import PropTypes from "prop-types";
import { LineSeparator } from "../styled";

const Separator = ({ text }) => {
  return (
    <LineSeparator>
      <hr />
      <span>{text}</span>
      <hr />
    </LineSeparator>
  );
};

Separator.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Separator;
