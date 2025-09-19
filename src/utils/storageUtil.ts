import type { Edge, Node } from "@xyflow/react";
import consts from "../constants/consts";

/**
 * Gets all the currently stored nodes from localStorage
 * @returns {Node[]} An array of the stored nodes
 */
export const getNodesFromStorage = (): Node[] => {
  let nodes: Node[] = [];
  const storedNodes = localStorage.getItem(consts.STORAGE_KEYS.NODES);
  if (storedNodes) {
    try {
      nodes = JSON.parse(storedNodes);
    } catch {
      console.error("Invalid JSON string stored in nodes store");
    }
  }
  return nodes;
};

/**
 * Saves an array of nodes to localStorage
 * @param {Node[]} nodes - The nodes to store
 */
export const saveNodesToStorage = (nodes: Node[]): void => {
  localStorage.setItem(consts.STORAGE_KEYS.NODES, JSON.stringify(nodes));
};

/**
 * Gets all the currently stored edges from localStorage
 * @returns {Edge[]} An array of the stored edges
 */
export const getEdgesFromStorage = (): Edge[] => {
  let edges: Edge[] = [];
  const storedEdges = localStorage.getItem(consts.STORAGE_KEYS.EDGES);
  if (storedEdges) {
    try {
      edges = JSON.parse(storedEdges);
    } catch {
      console.error("Invalid JSON string stored in edges store");
    }
  }
  return edges;
};

/**
 * Saves an array of edges to localStorage
 * @param {Edge[]} edges - The edges to store
 */
export const saveEdgesToStorage = (edges: Edge[]): void => {
  localStorage.setItem(consts.STORAGE_KEYS.EDGES, JSON.stringify(edges));
};

/**
 * Gets all the currently stored skill completions from localStorage
 * @returns {Map<string, boolean>} A map of the stored skill completions
 */
export const getCompletionsFromStorage = () => {
  let completions = new Map<string, boolean>();
  const storedCompletions = localStorage.getItem(
    consts.STORAGE_KEYS.COMPLETIONS,
  );
  if (storedCompletions) {
    try {
      completions = new Map(JSON.parse(storedCompletions));
    } catch {
      console.error("Invalid JSON string stored in completions store");
    }
  }
  return completions;
};

/**
 * Adds a skill completion to the map saves in the local storage
 * @param {string} id - The ID of the skill node
 * @param {boolean} isComplete - Whether the skill is complete or not
 */
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
