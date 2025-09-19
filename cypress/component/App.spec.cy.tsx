import App from "../../src//App";

describe("<App />", () => {
  beforeEach(() => {
    cy.clearAllLocalStorage();
  });

  afterEach(() => {
    cy.clearAllLocalStorage();
  });

  it("adds a node to the screen via the form", () => {
    cy.mount(<App />);

    cy.getByTestId("skill-node-0").should("not.exist");
    cy.getByTestId("skill-node-1").should("not.exist");
    cy.getByTestId("skill-node-2").should("not.exist");

    cy.openCreateNodeForm();
    cy.fillCreateNodeForm({ name: "Mobility", description: "Movement" });
    cy.getByTestId("add-skill-button").click();

    cy.getByTestId("close-form-button").click();

    cy.then(() => {
      cy.getByTestId("skill-node-0").should("not.exist");
      cy.getByTestId("skill-node-1");
      cy.getByTestId("skill-node-2").should("not.exist");
    });
  });

  it("adds multiple nodes to the screen via the form", () => {
    cy.mount(<App />);

    cy.getByTestId("skill-node-0").should("not.exist");
    cy.getByTestId("skill-node-1").should("not.exist");
    cy.getByTestId("skill-node-2").should("not.exist");
    cy.getByTestId("skill-node-3").should("not.exist");

    cy.openCreateNodeForm();
    cy.fillCreateNodeForm({ name: "Mobility", description: "Movement" });
    cy.getByTestId("add-skill-button").click();

    cy.then(() => {
      cy.clearCreateNodeForm();
      cy.fillCreateNodeForm({ name: "Agility", description: "Speed" });
      cy.getByTestId("add-skill-button").click();
    });

    cy.getByTestId("close-form-button").click();

    cy.then(() => {
      cy.getByTestId("skill-node-0").should("not.exist");
      cy.getByTestId("skill-node-1");
      cy.getByTestId("skill-node-2");
      cy.getByTestId("skill-node-3").should("not.exist");
    });
  });

  // TODO: Implement drag and drop
  it("adds multiple nodes and connects them together", () => {
    cy.mount(<App />);

    cy.openCreateNodeForm();
    cy.fillCreateNodeForm({ name: "Mobility", description: "Movement" });
    cy.getByTestId("add-skill-button").click();

    cy.then(() => {
      cy.clearCreateNodeForm();
      cy.fillCreateNodeForm({ name: "Agility", description: "Speed" });
      cy.getByTestId("add-skill-button").click();
    });

    cy.getByTestId("close-form-button").click();

    // cy.moveNode("skill-node-2", 0, 20);
    cy.getByTestId("skill-node-2")
      .trigger("mousedown", { which: 1 })
      .trigger("mousemove", { clientX: 20, clientY: 20 })
      .trigger("mouseup", { force: true });
  });
});
