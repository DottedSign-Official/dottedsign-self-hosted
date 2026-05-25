import { useCallback } from "react";
import { useSelector } from "react-redux";

/* NOTE:
type itemsLocal = {
  id: string;
  field_group_object_id: string;
  field_object_actions: {
    conditional_type: "field_setting" | "field_setting_group";
    conditional_object_id?: string;
  }[];
};
type groupLocal = {
  field_group_object_id: string;
};
*/

const useConditionCycleCheck = (groupLocal, itemsLocal) => {
  const { stages } = useSelector((state) => state.create);

  // NOTE: BFS traversal
  const detectCycleInGraph = (graph, startNode) => {
    const queue = [startNode];
    const visited = new Set();
    const inQueue = new Set([startNode]);

    while (queue.length > 0) {
      const node = queue.shift();
      inQueue.delete(node);
      visited.add(node);

      if (graph.has(node)) {
        const neighbors = graph.get(node);

        // NOTE: check self
        if (neighbors.has(node)) {
          return [node];
        }

        for (const neighbor of neighbors) {
          if (visited.has(neighbor) || inQueue.has(neighbor)) {
            // NOTE: cycle detected
            return [node];
          }

          // NOTE: add unvisited neighbors to queue
          queue.push(neighbor);
          inQueue.add(neighbor);
        }
      }
    }

    return null;
  };

  const checkCycles = useCallback(() => {
    const signer = itemsLocal?.[0]?.assigne;
    const stagesRes = stages.filter((stage) => {
      const isCurrentSigner = stage.assigne.uid === signer.uid;
      const isCurrentGroup =
        stage.field_group_object_id === groupLocal.field_group_object_id;
      const isConditionAble =
        stage.type === "checkbox" || stage.type === "textfield";
      return isCurrentSigner && !isCurrentGroup && isConditionAble;
    });
    const mergedStages = [...stagesRes, ...itemsLocal];

    const groupStagesMap = new Map();
    mergedStages.forEach((stage) => {
      if (stage.field_group_object_id) {
        if (!groupStagesMap.has(stage.field_group_object_id)) {
          groupStagesMap.set(stage.field_group_object_id, []);
        }
        groupStagesMap.get(stage.field_group_object_id).push(stage);
      }
    });

    // NOTE: convert group id to all child fields id
    const transformStages = mergedStages.map((stage) => {
      if (stage.field_object_actions) {
        const newActions = stage.field_object_actions.reduce((acc, action) => {
          if (action.conditional_type === "field_setting_group") {
            const groupStages =
              groupStagesMap.get(action.conditional_object_id) || [];
            const transformActions = groupStages.map((groupStage) => ({
              ...action,
              conditional_type: "field_setting",
              conditional_object_id: groupStage.id,
            }));
            return [...acc, ...transformActions];
          }
          return [...acc, action];
        }, []);
        return { ...stage, field_object_actions: newActions };
      }
      return stage;
    });

    const graph = new Map();
    const allNodes = new Set();

    // NOTE: build the graph and collect all nodes
    for (const stage of transformStages) {
      allNodes.add(stage.id);
      if (stage.field_object_actions) {
        for (const action of stage.field_object_actions) {
          if (action.conditional_object_id) {
            if (!graph.has(stage.id)) {
              graph.set(stage.id, new Set());
            }
            graph.get(stage.id).add(action.conditional_object_id);
            allNodes.add(action.conditional_object_id);
          }
        }
      }
    }

    // NOTE: check each node for cycle
    for (const node of allNodes) {
      const cycleNodes = detectCycleInGraph(graph, node);
      if (cycleNodes) {
        return cycleNodes;
      }
    }

    // NOTE: no cycle
    return [];
  }, [groupLocal, itemsLocal, stages]);

  return { checkCycles };
};

export default useConditionCycleCheck;
