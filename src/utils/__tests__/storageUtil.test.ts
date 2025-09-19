import { expect, describe, it, afterEach } from "vitest";
import consts from "../../constants/consts";
import {
  addCompletionToStorage,
  getCompletionsFromStorage,
  getEdgesFromStorage,
  getNodesFromStorage,
  saveEdgesToStorage,
  saveNodesToStorage,
} from "../storageUtil";
import type { Edge, Node } from "@xyflow/react";

const mockNodes: Node[] = [
  { id: "nodeId1", position: { x: 1, y: 2 }, data: {} },
  { id: "nodeId2", position: { x: 10, y: 5 }, data: {} },
];

const mockEdges: Edge[] = [
  { id: "edgeId", source: "nodeId1", target: "nodeId2" },
];

const mockCompletions: Map<string, boolean> = new Map<string, boolean>([
  ["nodeId1", true],
  ["nodeId2", false],
]);

describe("Storage Util", () => {
  afterEach(() => {
    localStorage.clear();
  });

  describe("getNodesFromStorage", () => {
    it("gets nodes from localStorage, if they exist", () => {
      localStorage.setItem(
        consts.STORAGE_KEYS.NODES,
        JSON.stringify(mockNodes),
      );
      expect(getNodesFromStorage()).toStrictEqual(mockNodes);
    });

    it("returns an empty array if no nodes exist", () => {
      expect(getNodesFromStorage()).toStrictEqual([]);
    });

    it("returns an empty array if invalid data is saved", () => {
      localStorage.setItem(consts.STORAGE_KEYS.NODES, "bingle");
      expect(getNodesFromStorage()).toStrictEqual([]);
    });
  });

  describe("saveNodesToStorage", () => {
    it("saves a valid array of nodes to the local storage", () => {
      saveNodesToStorage(mockNodes);
      const storedNodes = localStorage.getItem(consts.STORAGE_KEYS.NODES);
      expect(storedNodes).toEqual(JSON.stringify(mockNodes));
    });
  });

  describe("getEdgesFromStorage", () => {
    it("gets edges from localStorage, if they exist", () => {
      localStorage.setItem(
        consts.STORAGE_KEYS.EDGES,
        JSON.stringify(mockEdges),
      );
      expect(getEdgesFromStorage()).toStrictEqual(mockEdges);
    });

    it("returns an empty array if no edges exist", () => {
      expect(getEdgesFromStorage()).toStrictEqual([]);
    });

    it("returns an empty array if invalid data is saved", () => {
      localStorage.setItem(consts.STORAGE_KEYS.EDGES, "bongle");
      expect(getEdgesFromStorage()).toStrictEqual([]);
    });
  });

  describe("saveEdgesToStorage", () => {
    it("saves a valid array of edges to the local storage", () => {
      saveEdgesToStorage(mockEdges);
      const storedEdges = localStorage.getItem(consts.STORAGE_KEYS.EDGES);
      expect(storedEdges).toEqual(JSON.stringify(mockEdges));
    });
  });

  describe("getCompletionsFromStorage", () => {
    it("gets completions from localStorage, if they exist", () => {
      localStorage.setItem(
        consts.STORAGE_KEYS.COMPLETIONS,
        JSON.stringify(Array.from(mockCompletions.entries())),
      );
      expect(getCompletionsFromStorage()).toStrictEqual(mockCompletions);
    });

    it("returns an empty map if no completions exist", () => {
      expect(getCompletionsFromStorage()).toStrictEqual(
        new Map<string, boolean>(),
      );
    });

    it("returns an empty map if invalid data is saved", () => {
      localStorage.setItem(consts.STORAGE_KEYS.COMPLETIONS, "bangle");
      expect(getCompletionsFromStorage()).toStrictEqual(
        new Map<string, boolean>(),
      );
    });
  });

  describe("addCompletionToStorage", () => {
    it("adds a passing completion to the store", () => {
      expect(localStorage.getItem(consts.STORAGE_KEYS.COMPLETIONS)).toEqual(
        null,
      );

      addCompletionToStorage("nodeId1", true);

      expect(localStorage.getItem(consts.STORAGE_KEYS.COMPLETIONS)).toEqual(
        '[["nodeId1",true]]',
      );
    });

    it("adds a failing completion to the store", () => {
      expect(localStorage.getItem(consts.STORAGE_KEYS.COMPLETIONS)).toEqual(
        null,
      );

      addCompletionToStorage("nodeId1", false);

      expect(localStorage.getItem(consts.STORAGE_KEYS.COMPLETIONS)).toEqual(
        '[["nodeId1",false]]',
      );
    });
  });
});
