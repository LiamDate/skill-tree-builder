import { useState, type FC } from "react";
import "./SkillNode.css";
import { Position } from "@xyflow/react";
import SkillHandle from "../SkillHandle/SkillHandle";

const SkillNode: FC = () => {
  const [locked, setLocked] = useState<boolean>(true);

  const outerClassName = `skill-node-outer ${locked ? "skill-node-locked" : "skill-node-unlocked"}`;

  return (
    <div className={outerClassName}>
      <div
        className="skill-node-inner"
        onDoubleClick={() => setLocked(!locked)}
      />
      <SkillHandle position={Position.Top} id="top" />
      <SkillHandle position={Position.Bottom} id="bottom" />
    </div>
  );
};

export default SkillNode;
