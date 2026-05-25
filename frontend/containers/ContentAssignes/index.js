import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setAssignes as setAssignesAction } from "../../redux/actions/create";
import { STAGE_ACTION } from "../../constants/constants";
import { filterSignerAssignes } from "../../helpers/assignees/review";
import ToggleOrder from "../ToggleOrder";
import ListAssignes from "../ListAssignes";
import { WrapperTitle } from "./styled";

import BtnSigningGroup from "../../components/BtnSigningGroup";

const ContentAssignes = ({
  isEnvelope,
  isTemplateApplied,
  isModal,
  isBulkMenuVisible,
}) => {
  const {
    isTemplate,
    isOrder,
    assignes,
    assigneesWarnings,
    isImportedTemplateReadOnly,
    isPublicForm,
  } = useSelector((state) => state.create);

  const dispatch = useDispatch();
  const setAssignes = (data) => dispatch(setAssignesAction(data));

  const onUpdate = ({ newItems, isAdd }) => {
    // NOTE: 1. build map
    const reviewersMap = assignes.reduce((map, ass) => {
      if (ass.action === STAGE_ACTION.review && ass.actor_info.base_uid) {
        const signerUid = ass.actor_info?.base_uid;
        if (!map[signerUid]) {
          map[signerUid] = [];
        }
        map[signerUid].push(ass);
      }
      return map;
    }, {});

    // NOTE: 2. rebuild all assignes array
    const rebuiltAssignes = [];
    newItems.forEach((signer) => {
      const group = [signer, ...(reviewersMap[signer.uid] || [])];
      rebuiltAssignes.push(...group);
    });

    // NOTE: 3. reassign keys
    const finalAssignes = rebuiltAssignes.map((ass, idx) => ({
      ...ass,
      key: idx,
    }));

    setAssignes({
      assignes: finalAssignes,
      isAdd,
    });
  };

  const filteredAssignes = useMemo(
    () => filterSignerAssignes(assignes),
    [assignes],
  );

  const isToggleOrderEnabled =
    !isEnvelope && !isTemplateApplied && !isPublicForm;

  const isSignerGroup = (() => {
    if (isImportedTemplateReadOnly) {
      return false;
    }
    if (isPublicForm) {
      return false;
    }

    return true;
  })();

  const isUpward = (() => {
    if (isSignerGroup && !isToggleOrderEnabled && isBulkMenuVisible) {
      return true;
    }

    return false;
  })();

  return (
    <>
      <WrapperTitle isUpward={isUpward}>
        {isToggleOrderEnabled && <ToggleOrder />}
        {isSignerGroup && (
          <BtnSigningGroup isModal={isModal} isEnvelope={isEnvelope} />
        )}
      </WrapperTitle>

      <ListAssignes
        isTemplate={isTemplate}
        isTemplateApplied={isTemplateApplied}
        isPublicForm={isPublicForm}
        isOrder={isOrder}
        isModal={isModal}
        allAssignes={assignes}
        assignes={filteredAssignes}
        setAssignes={onUpdate}
        warnings={assigneesWarnings}
        position={isModal ? "assignFields" : "prepareDoc"}
      />
    </>
  );
};

export default ContentAssignes;
