import { type FC } from "react";
import { Handle, Position } from "@xyflow/react";
import "./SkillHandle.css";

interface ISkillHandleProps {
  id: string;
  position: Position;
}

const SkillHandle: FC<ISkillHandleProps> = ({ position, id }) => {
  return (
    <Handle
      type="source"
      position={position}
      // isValidConnection={(connection) => connection.source === source}
      // onConnect={(params) => console.log("handle onConnect", params)}
      className="handle"
      id={id}
    />
  );
};

export default SkillHandle;
