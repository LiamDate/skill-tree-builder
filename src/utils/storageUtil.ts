import type { Edge, Node } from "@xyflow/react";
import consts from "../constants/consts";

interface LoadFromStorageResponse {
  nodes: Node[];
  edges: Edge[];
}

export const loadFromStorage = (): LoadFromStorageResponse => {
  let nodes: Node[] = [];
  const storedNodesString = localStorage.getItem(
    consts.STORAGE_KEYS.SKILL_NODES,
  );
  if (storedNodesString) {
    nodes = JSON.parse(storedNodesString);
  }

  let edges: Edge[] = [];
  const storedConnectionsString = localStorage.getItem(
    consts.STORAGE_KEYS.CONNECTIONS,
  );
  if (storedConnectionsString) {
    edges = JSON.parse(storedConnectionsString);
  }

  return {
    nodes,
    edges,
  };
};

export const saveToStorage = (nodes: Node[], edges: Edge[]): void => {
  localStorage.setItem(consts.STORAGE_KEYS.SKILL_NODES, JSON.stringify(nodes));
  localStorage.setItem(consts.STORAGE_KEYS.CONNECTIONS, JSON.stringify(edges));
};

export const checkNodeCount = (): number => {
  let nodes: Node[] = [];
  const storedNodesString = localStorage.getItem(
    consts.STORAGE_KEYS.SKILL_NODES,
  );
  if (storedNodesString) {
    nodes = JSON.parse(storedNodesString);
  }
  return nodes.length;
};
