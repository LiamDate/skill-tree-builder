/// <reference types="cypress" />

import type { ReactElement } from "react";
import { ConnectionMode, ReactFlow, type ReactFlowProps } from "@xyflow/react";
import { fitViewOptions } from "../../src/utils/options";

Cypress.Commands.add("getByTestId", (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`);
});

Cypress.Commands.add("openCreateNodeForm", () => {
  cy.getByTestId("create-node-form").should("not.exist");
  cy.getByTestId("open-form-button").click();
  cy.getByTestId("create-node-form");
});

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

Cypress.Commands.add("clearCreateNodeForm", () => {
  cy.getByTestId("name-input-field").clear();
  cy.getByTestId("description-input-field").clear();
  cy.getByTestId("cost-input-field").clear();
});

Cypress.Commands.add(
  "mountFlowComponent",
  (component: ReactElement, flowProps?: ReactFlowProps) => {
    cy.mount(
      <ReactFlow
        nodes={flowProps?.nodes ?? []}
        edges={flowProps?.edges ?? []}
        fitView
        fitViewOptions={fitViewOptions}
        connectionMode={ConnectionMode.Loose}
      >
        {component}
      </ReactFlow>,
    );
  },
);

declare global {
  namespace Cypress {
    interface Chainable {
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
      openCreateNodeForm(): Chainable<void>;
      fillCreateNodeForm(fields: ICreateFormFields): Chainable<void>;
      clearCreateNodeForm(): Chainable<void>;
      mountFlowComponent(
        component: ReactElement,
        flowProps?: ReactFlowProps,
      ): Chainable<void>;
    }
  }
}

interface ICreateFormFields {
  name?: string;
  description?: string;
  cost?: number;
}
