import type { Edge, Node } from "@xyflow/react";
import consts from "../constants/consts";

export const getNodesFromStorage = (): Node[] => {
  let nodes: Node[] = [];
  const storedNodes = localStorage.getItem(consts.STORAGE_KEYS.NODES);
  if (storedNodes) {
    nodes = JSON.parse(storedNodes);
  }
  return nodes;
};

export const saveNodesToStorage = (nodes: Node[]): void => {
  localStorage.setItem(consts.STORAGE_KEYS.NODES, JSON.stringify(nodes));
};

export const getEdgesFromStorage = (): Edge[] => {
  let edges: Edge[] = [];
  const storedEdges = localStorage.getItem(consts.STORAGE_KEYS.EDGES);
  if (storedEdges) {
    edges = JSON.parse(storedEdges);
  }
  return edges;
};

export const saveEdgesToStorage = (edges: Edge[]): void => {
  localStorage.setItem(consts.STORAGE_KEYS.EDGES, JSON.stringify(edges));
};

export const getCompletionsFromStorage = () => {
  let completions = new Map<string, boolean>();
  const storedCompletions = localStorage.getItem(
    consts.STORAGE_KEYS.COMPLETIONS,
  );
  if (storedCompletions) {
    completions = new Map(JSON.parse(storedCompletions));
  }
  return completions;
};

export const addCompletionToStorage = (id: string, isComplete: boolean) => {
  const completions = getCompletionsFromStorage();
  if (completions) {
    completions.set(id, isComplete);
    localStorage.setItem(
      consts.STORAGE_KEYS.COMPLETIONS,
      JSON.stringify(Array.from(completions.entries())),
    );
  }
};
