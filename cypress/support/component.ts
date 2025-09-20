import "./commands";
import { mount } from "cypress/react";
import "cypress-real-events";

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

Cypress.Commands.add("mount", mount);
