import { useMemo, type FC } from "react";
import {
  getIncomers,
  Handle,
  Position,
  useConnection,
  useEdges,
  useNodes,
  type Connection,
  type Edge,
} from "@xyflow/react";
import "./SkillHandle.css";

interface ISkillHandleProps {
  id: string;
  position: Position;
}

const SkillHandle: FC<ISkillHandleProps> = ({ position, id }) => {
  const nodes = useNodes();
  const edges = useEdges();
  const connection = useConnection();

  const colourClassName = useMemo(
    () =>
      !connection || connection.isValid === null
        ? "unchecked"
        : connection.isValid
          ? "valid"
          : "invalid",
    [connection],
  );

  const isValidConnection = (connection: Edge | Connection): boolean => {
    const targetId = connection.source;

    if (targetId === connection.target) return false;

    const checkIncomingConnections = (
      nodeId: string,
      visitedNodes = new Set<string>(),
    ): boolean | undefined => {
      if (visitedNodes.has(nodeId)) return false;

      visitedNodes.add(nodeId);

      const incomers = getIncomers({ id: nodeId }, nodes, edges);
      for (const incomer of incomers) {
        if (incomer.id === connection.target) {
          return true;
        }
        if (checkIncomingConnections(incomer.id, visitedNodes)) {
          return true;
        }
      }
    };

    const validConnection = !checkIncomingConnections(targetId);

    if (!validConnection) {
      var toast = document.getElementById("toast");
      toast?.setAttribute("class", "show");
      setTimeout(function () {
        toast?.setAttribute("class", "");
      }, 5000);
    }

    return validConnection;
  };

  return (
    <Handle
      type="source"
      position={position}
      isValidConnection={isValidConnection}
      className={`handle ${colourClassName}`}
      id={id}
    />
  );
};

export default SkillHandle;
