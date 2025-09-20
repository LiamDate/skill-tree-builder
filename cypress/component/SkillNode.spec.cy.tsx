import type { Node } from "@xyflow/react";
import SkillNode from "../../src/components/SkillNode";
import consts from "../../src/constants/consts";

const mockNodes: Node[] = [
  { id: "nodeId1", position: { x: 1, y: 2 }, data: {} },
];

describe("<SkillNode />", () => {
  it("unlocks when double clicked, if there are no prerequisites", () => {
    cy.mountFlowComponent(<SkillNode />, { nodes: mockNodes });

    cy.hideBlockingElements();

    cy.completeValidNode("1");

    cy.checkStoreSize([
      { storageKey: consts.STORAGE_KEYS.COMPLETIONS, expectedSize: 1 },
    ]);
  });
});
