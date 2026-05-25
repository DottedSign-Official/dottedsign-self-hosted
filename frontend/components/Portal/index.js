import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

const createContainer = (zIndex) => {
  const container = document.createElement("div");
  container.setAttribute("class", "portal");
  container.setAttribute("style", `z-index: ${zIndex};`);
  return container;
};

const canUseDOM = () =>
  typeof window !== "undefined" &&
  window.document &&
  window.document.createElement;

const Portal = ({ zIndex, children }) => {
  const defaultContainer = canUseDOM() ? createContainer(zIndex) : undefined;
  const [container, setContainer] = useState(defaultContainer);

  useEffect(() => {
    if (container) {
      document.body.appendChild(container);
    } else {
      const newContainer = createContainer(zIndex);
      setContainer(newContainer);
    }

    return () => {
      if (container && container.parentNode === document.body) {
        document.body.removeChild(container);
      }
    };
  }, [container, zIndex]);

  return container ? ReactDOM.createPortal(children, container) : children;
};

Portal.propTypes = {
  zIndex: PropTypes.number,
  children: PropTypes.element.isRequired,
};

Portal.defaultProps = {
  zIndex: 0,
};

export default Portal;
