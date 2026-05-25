import React from "react";
import PropTypes from "prop-types";
import Lottie from "react-lottie-player";

const Animation = ({ width, height, animationData, isOnce, isStopped }) => {
  return (
    <Lottie
      animationData={animationData}
      play={!isStopped}
      loop={!isOnce}
      style={{
        width: width ? width : "50px",
        height: height ? height : "50px",
      }}
    />
  );
};

Animation.propTypes = {
  isOnce: PropTypes.bool,
  autoplay: PropTypes.bool,
  isStopped: PropTypes.bool,
};

Animation.defaultProps = {
  isOnce: false,
  autoplay: true,
  isStopped: false,
};

export default Animation;
