import { useMemo, type FC } from "react";
import {
  getIncomers,
  Handle,
  Position,
  useConnection,
  useNodeId,
  type Connection,
  type Edge,
} from "@xyflow/react";
import "./SkillHandle.css";
import {
  getEdgesFromStorage,
  getNodesFromStorage,
} from "../../utils/storageUtil";

interface ISkillHandleProps {
  id: string;
  position: Position;
}

/**
 * Custom handle component that attaches edges to skill nodes.
 * @typedef {object} ISkillHandleProps
 * @property {string} id - The ID of the handle.
 * @property {Position} position - The current position of the handle.
 *
 * @param {ISkillHandleProps} props - The props for the handle component.
 * @returns {FC} The handle component.
 */
const SkillHandle: FC<ISkillHandleProps> = ({ position, id }) => {
  const currentConnection = useConnection();
  const nodeId = useNodeId();

  // Gets the class name for the current colour used in the handles
  const colourClassName = useMemo(
    () =>
      !currentConnection ||
      currentConnection.isValid === null ||
      currentConnection.toNode?.id !== nodeId
        ? "unchecked"
        : currentConnection.isValid
          ? "valid"
          : "invalid",
    [currentConnection],
  );

  /**
   * Checks whether a connection is valid and only allows the connection if it is.
   * @param {connection: Edge | Connection} connection - The new connection being validated.
   * @returns {boolean} A boolean whether it's valid or not.
   */
  const isValidConnection = (connection: Edge | Connection): boolean => {
    const nodes = getNodesFromStorage();
    const edges = getEdgesFromStorage();

    const targetId = connection.source;

    let validConnection: boolean = true;

    // Fails validation if the node tries to connect to itself
    if (targetId === connection.target) validConnection = false;

    /**
     * Recursively checks the prerequisite nodes for the current node, returning true if it finds the original node.
     * @param {string} nodeId - The ID of the current node being checked.
     * @param {Set<string>} visitedNodes - A set of all previously checked nodes.
     * @returns {boolean | undefined} Whether the original node has been found.
     */
    const checkIncomingConnections = (
      nodeId: string,
      visitedNodes = new Set<string>(),
    ): boolean | undefined => {
      // Exits this recusion level if the node has already been checked
      if (visitedNodes.has(nodeId)) return true;

      visitedNodes.add(nodeId);

      // Loops through all nodes with incoming connections to the current node
      const incomers = getIncomers({ id: nodeId }, nodes, edges);
      for (const incomer of incomers) {
        // Returns true if the current node matches the original, and recursively calls this function if it doesn't
        if (
          incomer.id === connection.target ||
          checkIncomingConnections(incomer.id, visitedNodes)
        ) {
          return true;
        }
      }
    };

    // If the node isn't connecting to itself, perform the more complex validation
    if (validConnection) {
      validConnection = !checkIncomingConnections(targetId);
    }

    // If the connection isn't valid, temporarily display the invalid toast
    if (!validConnection) {
      const toast = document.getElementById("toast");
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
