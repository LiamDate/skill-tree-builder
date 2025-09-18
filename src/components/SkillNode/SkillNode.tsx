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

const SkillNode: FC = () => {
  const [prerequisitesComplete, setPrerequisitesComplete] =
    useState<boolean>(false);
  const [locked, setLocked] = useState<boolean>(true);

  const nodeId = useNodeId() ?? "";
  const nodeData = useNodesData(nodeId)?.data;
  const nodeConnections = useNodeConnections({ id: nodeId });

  useEffect(() => {
    const storedCompletions = getCompletionsFromStorage();
    const isComplete = storedCompletions.get(nodeId);
    setLocked(!isComplete);
  }, [prerequisitesComplete]);

  const outerClassName = useMemo(
    () =>
      `skill-node-outer ${locked ? "skill-node-locked" : "skill-node-unlocked"}`,
    [locked],
  );

  const checkPrerequisites = () => {
    const storedCompletions = getCompletionsFromStorage();

    let prerequisiteCounter = 0;
    let prerequisites = 0;

    nodeConnections.forEach((connection) => {
      if (connection.target === nodeId) {
        prerequisiteCounter += 1;
        const isPrerequisiteComplete = storedCompletions.get(connection.source);
        if (isPrerequisiteComplete) {
          prerequisites += 1;
        }
      }
    });

    let arePrerequisitesComplete = false;

    if (prerequisiteCounter === prerequisites) {
      arePrerequisitesComplete = true;
      setPrerequisitesComplete(true);
    } else {
      alert(
        "You must complete pre-requisite skills before completing this one.",
      );
    }

    addCompletionToStorage(nodeId, arePrerequisitesComplete);
  };

  return (
    <div className={outerClassName}>
      <div
        className="skill-node-inner"
        onDoubleClick={() => checkPrerequisites()}
      >
        {nodeData && (nodeData[consts.SKILL_FIELDS.NAME] as string)}
      </div>
      <SkillHandle position={Position.Top} id="top" />
      <SkillHandle position={Position.Bottom} id="bottom" />
    </div>
  );
};

export default SkillNode;
