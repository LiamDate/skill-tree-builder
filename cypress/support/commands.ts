/// <reference types="cypress" />

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

declare global {
  namespace Cypress {
    interface Chainable {
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
      openCreateNodeForm(): Chainable<void>;
      fillCreateNodeForm(fields: ICreateFormFields): Chainable<void>;
    }
  }
}

interface ICreateFormFields {
  name?: string;
  description?: string;
  cost?: number;
}
