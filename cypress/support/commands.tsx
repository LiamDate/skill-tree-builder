/// <reference types="cypress" />

import type { ReactElement } from "react";
import { ConnectionMode, ReactFlow, type ReactFlowProps } from "@xyflow/react";
import { fitViewOptions } from "../../src/utils/options";
import { nodeTypes } from "../../src/utils/flowTypes";

/**
 * Wrapper to easily return elements via their test id.
 * @param {string} testId - The test id of the element we want to get.
 */
Cypress.Commands.add("getByTestId", (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`);
});

/**
 * Mounts React Flow components in the ReactFlow element.
 * Needed to render certain components in the component tests.
 * @param {ReactElement} component - The component to mount.
 * @param {ReactFlowProps} [flowProps] - The props of the ReactFlow component.
 */
Cypress.Commands.add(
  "mountFlowComponent",
  (component: ReactElement, flowProps?: ReactFlowProps) => {
    cy.mount(
      <ReactFlow
        nodes={flowProps?.nodes ?? []}
        edges={flowProps?.edges ?? []}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={fitViewOptions}
        connectionMode={ConnectionMode.Loose}
      >
        {component}
      </ReactFlow>,
    );
  },
);

/**
 * Hides React Flow elements that cover components in certain component tests.
 */
Cypress.Commands.add("hideBlockingElements", () => {
  document
    .querySelector("react-flow__pane draggable")
    ?.setAttribute("style", "visibility: hidden");
  document
    .querySelector(".react-flow__renderer")
    ?.setAttribute("style", "visibility: hidden");
});

/**
 * Zooms out to the maximum point in order to keep all nodes on screen at once
 */
Cypress.Commands.add("zoomOut", () => {
  cy.get('[class="react-flow__pane draggable"]').realMouseWheel({
    deltaY: 1000,
  });
});

/**
 * Opens the Create Node Form.
 */
Cypress.Commands.add("openCreateNodeForm", () => {
  cy.getByTestId("create-node-form").should("not.exist");
  cy.getByTestId("open-form-button").click();
  cy.getByTestId("create-node-form");
});

/**
 * Fills in the Create Node Form.
 * @param {ICreateFormFields} fields - The values of the fields that should be filled in.
 */
Cypress.Commands.add("fillCreateNodeForm", (fields: ICreateFormFields) => {
  const { name, description, cost } = fields;
  if (name) {
    cy.getByTestId("name-input-field").type(name);
  }
  if (description) {
    cy.getByTestId("description-input-field").type(description);
  }
  if (cost) {
    cy.getByTestId("cost-input-field").type(cost.toString());
  }
});

/**
 * Clears the fields in the Create Node Form.
 */
Cypress.Commands.add("clearCreateNodeForm", () => {
  cy.getByTestId("name-input-field").clear();
  cy.getByTestId("description-input-field").clear();
  cy.getByTestId("cost-input-field").clear();
});

/**
 * Closes the Create Node Form.
 */
Cypress.Commands.add("closeCreateNodeForm", () => {
  cy.getByTestId("create-node-form");
  cy.getByTestId("close-form-button").click();
  cy.getByTestId("create-node-form").should("not.exist");
});

/**
 * Creates one or more new nodes.
 */
Cypress.Commands.add("createNewNodes", (nodeFields: ICreateFormFields[]) => {
  cy.openCreateNodeForm();
  nodeFields.forEach((nodeField) => {
    const { name, description, cost } = nodeField;
    cy.clearCreateNodeForm();
    cy.fillCreateNodeForm({ name, description, cost });
    cy.getByTestId("add-skill-button").click();
  });
  cy.closeCreateNodeForm();
});

/**
 * Moves a node to specific coordinates on the screen.
 * @param {string} nodeId - The ID of the node to move.
 * @param {number} x - The x coordinate the move the node to.
 * @param {number} y - The y coordinate the move the node to.
 */
Cypress.Commands.add("moveNode", (nodeId: string, x: number, y: number) => {
  cy.getByTestId(`skill-node-${nodeId}`)
    .realMouseDown({ button: "left", position: "center" })
    .realMouseMove(0, 10, { position: "center" })
    .wait(200)
    .realMouseMove(x, y, { position: "center" })
    .realMouseUp();
});

/**
 * Connects two nodes together.
 * @param {IHandleDetails} sourceNode - The details of the source node.
 * @param {IHandleDetails} targetNode - The details of the target node.
 */
Cypress.Commands.add(
  "connectNodes",
  (sourceNode: IHandleDetails, targetNode: IHandleDetails) => {
    cy.getByTestId(
      `skill-handle-${sourceNode.nodeId}-${sourceNode.handlePosition}`,
    )
      .realMouseDown({ button: "left", position: "center" })
      .realMouseMove(0, 10, { position: "center" });

    cy.getByTestId(
      `skill-handle-${targetNode.nodeId}-${targetNode.handlePosition}`,
    )
      .scrollIntoView()
      .realMouseMove(0, 0, { position: "center" })
      .realMouseUp();
  },
);

/**
 * Checks the size of the given fields in the local storage.
 * @param {IStoreCheck[]} storesToCheck - The details of the stores to be checked.
 */
Cypress.Commands.add("checkStoreSize", (storesToCheck: IStoreCheck[]) => {
  cy.getAllLocalStorage().then((storage) => {
    const localStorage = Object.values(storage)[0];
    storesToCheck.forEach((storeToCheck) => {
      expect(localStorage).to.have.property(storeToCheck.storageKey);

      const storeValueString =
        localStorage[storeToCheck.storageKey]?.toString();

      if (storeValueString) {
        const storeValue = JSON.parse(storeValueString);
        expect(storeValue).to.have.length(storeToCheck.expectedSize);
      }
    });
  });
});

/**
 * Completes a skill node, if it can be completed.
 * @param {string} nodeId - The ID of the node to be completed.
 */
Cypress.Commands.add("completeValidNode", (nodeId: string) => {
  cy.getByTestId(`skill-node-${nodeId}`).should(
    "have.class",
    "skill-node-locked",
  );
  cy.getByTestId(`skill-node-inner-${nodeId}`).dblclick();
  cy.getByTestId(`skill-node-${nodeId}`).should(
    "have.class",
    "skill-node-unlocked",
  );
});

/**
 * Fails to compelte a skill node, if it can't be completed.
 * @param {string} nodeId - The ID of the node to be completed.
 */
Cypress.Commands.add("completeInvalidNode", (nodeId: string) => {
  const alertStub = cy.stub();
  cy.on("window:alert", alertStub);

  cy.getByTestId(`skill-node-${nodeId}`).should(
    "have.class",
    "skill-node-locked",
  );
  cy.getByTestId("skill-node-inner-2")
    .dblclick()
    .then(() => {
      expect(alertStub.getCall(0)).to.be.calledWith(
        "You must complete pre-requisite skills before completing this one.",
      );
    });
  cy.getByTestId(`skill-node-${nodeId}`).should(
    "have.class",
    "skill-node-locked",
  );
});

declare global {
  namespace Cypress {
    interface Chainable {
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
      mountFlowComponent(
        component: ReactElement,
        flowProps?: ReactFlowProps,
      ): Chainable<void>;
      hideBlockingElements(): Chainable<void>;
      zoomOut(): Chainable<void>;
      openCreateNodeForm(): Chainable<void>;
      fillCreateNodeForm(fields: ICreateFormFields): Chainable<void>;
      clearCreateNodeForm(): Chainable<void>;
      closeCreateNodeForm(): Chainable<void>;
      createNewNodes(nodeFields: ICreateFormFields[]): Chainable<void>;
      moveNode(nodeId: string, x: number, y: number): Chainable<void>;
      connectNodes(
        sourceNode: IHandleDetails,
        targetNode: IHandleDetails,
      ): Chainable<void>;
      checkStoreSize(storesToCheck: IStoreCheck[]): Chainable<void>;
      completeValidNode(nodeId: string): Chainable<void>;
      completeInvalidNode(nodeId: string): Chainable<void>;
    }
  }
}

interface ICreateFormFields {
  name?: string;
  description?: string;
  cost?: number;
}

interface IHandleDetails {
  nodeId: string;
  handlePosition: string;
}

interface IStoreCheck {
  storageKey: string;
  expectedSize: number;
}
