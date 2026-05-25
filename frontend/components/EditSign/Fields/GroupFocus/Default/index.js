import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Element } from "./styled";

const DefaultValue = ({ coordsFocus, stages, group, onUpdateStages }) => {
  const [isRequiredHints, setIsRequiredHints] = useState([]);
  const isRadio = group.field_group_type !== "checkbox";

  const order = (() => {
    if (!stages) {
      return -1;
    }
    if (!stages[0]) {
      return -1;
    }
    if (!stages[0].assigne) {
      return -1;
    }
    if (typeof stages[0].assigne.key === "undefined") {
      return -1;
    }

    return stages[0].assigne.key % 8;
  })();

  const Container = document.getElementById(
    `focus-group-${group.field_group_object_id}`,
  );

  const onToggle = (stg) => () => {
    if (!stg) {
      return;
    }

    const valNew = !stg.options?.default;

    const stagesNew = stages.map((stage) => {
      if (stage.id === stg.id) {
        return {
          ...stage,
          options: {
            ...stage.options,
            default: valNew,
          },
        };
      }

      // NOTE: radio limit
      if (isRadio && valNew === true) {
        return {
          ...stage,
          options: {
            ...stage.options,
            default: false,
          },
        };
      }

      return { ...stage };
    });

    onUpdateStages(stagesNew);
  };

  useEffect(() => {
    const isGroupForce = group.options.force;
    const isHasDefault = stages.some((stage) => stage.options.default);
    const newIsRequiredHints = stages.map(() => isGroupForce && !isHasDefault);

    setIsRequiredHints(newIsRequiredHints);
  }, [stages, group.options.force]);

  if (!Container) {
    return null;
  }

  return stages.map((stage, index) => {
    const val =
      typeof stage.options?.default !== "undefined"
        ? stage.options?.default
        : false;

    const Content = (
      <Element
        id={`default-${stage.id}`}
        order={order}
        type={isRadio ? "radio" : "checkbox"}
        checked={val}
        onClick={onToggle(stage)}
        coords={stage.coords}
        coordsFocus={coordsFocus}
        isRequiredHint={isRequiredHints[index]}
      />
    );

    return ReactDOM.createPortal(Content, Container);
  });
};

export default DefaultValue;
