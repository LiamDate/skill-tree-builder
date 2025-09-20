import { useEffect, useMemo, useState, type FC } from "react";
import "./SkillNode.css";
import {
  Position,
  useNodeConnections,
  useNodeId,
  useNodesData,
} from "@xyflow/react";
import SkillHandle from "../SkillHandle/SkillHandle";
import consts from "../../constants/consts";
import {
  addCompletionToStorage,
  getCompletionsFromStorage,
} from "../../utils/storageUtil";

/**
 * Custom node component that represents user-inputted skill.
 * @returns {FC} The skill node component.
 */
const SkillNode: FC = () => {
  const [prerequisitesComplete, setPrerequisitesComplete] =
    useState<boolean>(false);
  const [locked, setLocked] = useState<boolean>(true);

  const nodeId = useNodeId() ?? "1";
  const nodeData = useNodesData(nodeId)?.data;
  const nodeConnections = useNodeConnections({ id: nodeId });

  useEffect(() => {
    const storedCompletions = getCompletionsFromStorage();
    const isComplete = storedCompletions.get(nodeId);
    setLocked(!isComplete);
  }, [prerequisitesComplete]);

  // Gets the class name depending on whether the cell is locked or not
  const outerClassName = useMemo(
    () =>
      `skill-node-outer ${locked ? "skill-node-locked" : "skill-node-unlocked"}`,
    [locked],
  );

  /**
   * Checks whether the prerequisites for a node are complete before completing the node.
   */
  const checkPrerequisites = () => {
    const storedCompletions = getCompletionsFromStorage();

    let arePrerequisitesComplete = false;
    let totalPrerequisites = 0;
    let completePrerequisites = 0;

    // Loops through all connections to the current nodes
    nodeConnections.forEach((connection) => {
      // Checks whether the curent connection is a prerequisite
      if (connection.target === nodeId) {
        totalPrerequisites += 1;
        // Checks whether the prerequisite is complete
        const isPrerequisiteComplete = storedCompletions.get(connection.source);
        if (isPrerequisiteComplete) {
          completePrerequisites += 1;
        }
      }
    });

    // If all prerequisites are complete, complete this skill. Otherwise display an error.
    if (totalPrerequisites === completePrerequisites) {
      arePrerequisitesComplete = true;
      setPrerequisitesComplete(true);
    } else {
      alert(
        "You must complete pre-requisite skills before completing this one.",
      );
    }

    // Store the completion status of this node.
    addCompletionToStorage(nodeId, arePrerequisitesComplete);
  };

  return (
    <div className={outerClassName} data-testid={`skill-node-${nodeId}`}>
      <div
        className="skill-node-inner"
        onDoubleClick={() => checkPrerequisites()}
        data-testid={`skill-node-inner-${nodeId}`}
      >
        {nodeData && (nodeData[consts.SKILL_FIELDS.NAME] as string)}
      </div>
      <SkillHandle position={Position.Top} id="top" />
      <SkillHandle position={Position.Bottom} id="bottom" />
    </div>
  );
};

export default SkillNode;
