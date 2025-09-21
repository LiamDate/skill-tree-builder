import App from "../../src/App";
import consts from "../../src/constants/consts";

/**
 * Note: If you run these tests previously and then try to run them again, they might fail as
 * Cypress doesn't always tear down the local store properly. Adding manual store teardowns to
 * the tests doesn't fix this. To fix this, clear the local store manually and run the tests again.
 *
 * This is an issue with how Cypress interacts with the local store, not my code.
 */

describe("<App />", () => {
  it("adds a node to the screen via the form", () => {
    cy.mount(<App />);

    cy.getByTestId("skill-node-0").should("not.exist");
    cy.getByTestId("skill-node-1").should("not.exist");
    cy.getByTestId("skill-node-2").should("not.exist");

    cy.createNewNodes([{ name: "Mobility", description: "Movement" }]);

    cy.then(() => {
      cy.getByTestId("skill-node-0").should("not.exist");
      cy.getByTestId("skill-node-1");
      cy.getByTestId("skill-node-2").should("not.exist");
    });
  });

  it("views a new nodes details when clicking on it", () => {
    cy.mount(<App />);

    cy.createNewNodes([{ name: "Mobility", description: "Movement" }]);

    cy.getByTestId("skill-information-panel").should("not.exist");

    cy.getByTestId("skill-node-1").within(() =>
      cy.getByTestId("skill-node-inner-1").click(),
    );

    cy.getByTestId("skill-information-panel").within(() => {
      cy.getByTestId("skill-field-name").should("contain", "Name: Mobility");
      cy.getByTestId("skill-field-description").should(
        "contain",
        "Description: Movement",
      );
    });
  });

  it("opens and closes a new nodes details when clicking on it", () => {
    cy.mount(<App />);

    cy.createNewNodes([{ name: "Mobility", description: "Movement" }]);

    cy.getByTestId("skill-information-panel").should("not.exist");

    cy.getByTestId("skill-node-1").within(() =>
      cy.getByTestId("skill-node-inner-1").click(),
    );

    cy.getByTestId("skill-information-panel");
    cy.getByTestId("close-skill-information-button").click();
    cy.getByTestId("skill-information-panel").should("not.exist");
  });

  it("adds multiple nodes to the screen via the form", () => {
    cy.mount(<App />);

    cy.getByTestId("skill-node-0").should("not.exist");
    cy.getByTestId("skill-node-1").should("not.exist");
    cy.getByTestId("skill-node-2").should("not.exist");
    cy.getByTestId("skill-node-3").should("not.exist");

    cy.createNewNodes([
      { name: "Mobility", description: "Movement" },
      { name: "Agility", description: "Speed" },
    ]);

    cy.then(() => {
      cy.getByTestId("skill-node-0").should("not.exist");
      cy.getByTestId("skill-node-1");
      cy.getByTestId("skill-node-2");
      cy.getByTestId("skill-node-3").should("not.exist");
    });
  });

  it("stores new nodes in local storage", () => {
    cy.mount(<App />);

    cy.checkEmptyStore();

    cy.createNewNodes([
      { name: "Mobility", description: "Movement" },
      { name: "Agility", description: "Speed" },
    ]);

    cy.checkStoreSize([
      { storageKey: consts.STORAGE_KEYS.NODES, expectedSize: 2 },
    ]);
  });

  it("adds multiple nodes and connects them together, storing the edges in local storage", () => {
    cy.mount(<App />);

    cy.createNewNodes([
      { name: "Mobility", description: "Movement" },
      { name: "Agility", description: "Speed" },
      { name: "Capability", description: "Competence" },
      { name: "Ability", description: "Skill" },
    ]);

    cy.zoomOut();

    cy.moveNode("4", -200, 200);
    cy.moveNode("3", 0, 400);
    cy.moveNode("2", 200, 200);

    cy.checkStoreSize([
      { storageKey: consts.STORAGE_KEYS.EDGES, expectedSize: 0 },
    ]);

    cy.connectNodes(
      { nodeId: "1", handlePosition: "bottom" },
      { nodeId: "2", handlePosition: "top" },
    );

    cy.connectNodes(
      { nodeId: "2", handlePosition: "bottom" },
      { nodeId: "3", handlePosition: "top" },
    );

    cy.connectNodes(
      { nodeId: "3", handlePosition: "bottom" },
      { nodeId: "4", handlePosition: "top" },
    );

    cy.checkStoreSize([
      { storageKey: consts.STORAGE_KEYS.EDGES, expectedSize: 3 },
    ]);
  });

  context("which checks for skill completions", () => {
    it("completes skill when double clicked", () => {
      cy.mount(<App />);

      cy.checkEmptyStore();

      cy.createNewNodes([{ name: "Mobility", description: "Movement" }]);

      cy.completeValidNode("1");

      cy.checkStoreSize([
        { storageKey: consts.STORAGE_KEYS.COMPLETIONS, expectedSize: 1 },
      ]);
    });

    it("doesn't complete skills if they have an incomplete prerequisite", () => {
      cy.mount(<App />);

      cy.createNewNodes([
        { name: "Mobility", description: "Movement" },
        { name: "Agility", description: "Speed" },
      ]);

      cy.zoomOut();

      cy.moveNode("2", 200, 200);

      cy.connectNodes(
        { nodeId: "1", handlePosition: "bottom" },
        { nodeId: "2", handlePosition: "top" },
      );

      cy.completeInvalidNode("2");

      cy.completeValidNode("1");
      cy.completeValidNode("2");
    });

    it("doesn't complete skills if they have multiple incomplete prerequisites", () => {
      cy.mount(<App />);

      cy.createNewNodes([
        { name: "Mobility", description: "Movement" },
        { name: "Agility", description: "Speed" },
        { name: "Capability", description: "Competence" },
        { name: "Ability", description: "Skill" },
      ]);

      cy.zoomOut();

      cy.moveNode("4", -200, 200);
      cy.moveNode("3", 0, 400);
      cy.moveNode("2", 200, 200);

      cy.connectNodes(
        { nodeId: "1", handlePosition: "bottom" },
        { nodeId: "2", handlePosition: "top" },
      );

      cy.connectNodes(
        { nodeId: "3", handlePosition: "bottom" },
        { nodeId: "2", handlePosition: "top" },
      );

      cy.connectNodes(
        { nodeId: "4", handlePosition: "bottom" },
        { nodeId: "2", handlePosition: "top" },
      );

      cy.completeInvalidNode("2");
    });

    it("doesn't complete skills if there is a chain of incomplete prerequisites", () => {
      cy.mount(<App />);

      cy.createNewNodes([
        { name: "Mobility", description: "Movement" },
        { name: "Agility", description: "Speed" },
        { name: "Capability", description: "Competence" },
        { name: "Ability", description: "Skill" },
      ]);

      cy.zoomOut();

      cy.moveNode("4", -200, 200);
      cy.moveNode("3", 0, 400);
      cy.moveNode("2", 200, 200);

      cy.connectNodes(
        { nodeId: "1", handlePosition: "bottom" },
        { nodeId: "2", handlePosition: "top" },
      );

      cy.connectNodes(
        { nodeId: "3", handlePosition: "bottom" },
        { nodeId: "2", handlePosition: "top" },
      );

      cy.connectNodes(
        { nodeId: "4", handlePosition: "bottom" },
        { nodeId: "3", handlePosition: "top" },
      );

      cy.completeInvalidNode("2");
    });

    it("completes skills if they have multiple prerequisites that are all complete", () => {
      cy.mount(<App />);

      cy.createNewNodes([
        { name: "Mobility", description: "Movement" },
        { name: "Agility", description: "Speed" },
        { name: "Capability", description: "Competence" },
        { name: "Ability", description: "Skill" },
      ]);

      cy.zoomOut();

      cy.moveNode("4", -200, 200);
      cy.moveNode("3", 0, 400);
      cy.moveNode("2", 200, 200);

      cy.connectNodes(
        { nodeId: "1", handlePosition: "bottom" },
        { nodeId: "2", handlePosition: "top" },
      );

      cy.connectNodes(
        { nodeId: "3", handlePosition: "bottom" },
        { nodeId: "2", handlePosition: "top" },
      );

      cy.connectNodes(
        { nodeId: "4", handlePosition: "bottom" },
        { nodeId: "2", handlePosition: "top" },
      );

      cy.completeInvalidNode("2");

      cy.completeValidNode("1");
      cy.completeValidNode("3");
      cy.completeValidNode("4");
      cy.completeValidNode("2");
    });

    it("completes skills if they have one prerequisite that's complete", () => {
      cy.mount(<App />);

      cy.createNewNodes([
        { name: "Mobility", description: "Movement" },
        { name: "Agility", description: "Speed" },
      ]);

      cy.zoomOut();

      cy.moveNode("2", 200, 200);

      cy.connectNodes(
        { nodeId: "1", handlePosition: "bottom" },
        { nodeId: "2", handlePosition: "top" },
      );

      cy.completeInvalidNode("2");

      cy.completeValidNode("1");
      cy.completeValidNode("2");
    });

    it("completes skills if all prerequisites and parent prerequisites are complete", () => {
      cy.mount(<App />);

      cy.createNewNodes([
        { name: "Mobility", description: "Movement" },
        { name: "Agility", description: "Speed" },
        { name: "Capability", description: "Competence" },
        { name: "Ability", description: "Skill" },
      ]);

      cy.zoomOut();

      cy.moveNode("4", -200, 200);
      cy.moveNode("3", 0, 400);
      cy.moveNode("2", 200, 200);

      cy.connectNodes(
        { nodeId: "1", handlePosition: "bottom" },
        { nodeId: "2", handlePosition: "top" },
      );

      cy.connectNodes(
        { nodeId: "3", handlePosition: "bottom" },
        { nodeId: "2", handlePosition: "top" },
      );

      cy.connectNodes(
        { nodeId: "4", handlePosition: "bottom" },
        { nodeId: "3", handlePosition: "top" },
      );

      cy.completeInvalidNode("2");
      cy.completeValidNode("4");
      cy.completeInvalidNode("2");
      cy.completeValidNode("3");
      cy.completeInvalidNode("2");
      cy.completeValidNode("1");
      cy.completeValidNode("2");
    });
  });

  context("which doesn't allow circular dependencies", () => {
    it("allows loops if they're not circular dependencies", () => {
      cy.mount(<App />);

      cy.checkEmptyStore();

      cy.createNewNodes([
        { name: "Mobility", description: "Movement" },
        { name: "Agility", description: "Speed" },
        { name: "Capability", description: "Competence" },
      ]);

      cy.zoomOut();

      cy.moveNode("3", 0, 400);
      cy.moveNode("2", 200, 200);

      cy.connectNodes(
        { nodeId: "1", handlePosition: "bottom" },
        { nodeId: "2", handlePosition: "top" },
      );

      cy.getByTestId("toast").should("not.be.visible");

      cy.connectNodes(
        { nodeId: "2", handlePosition: "bottom" },
        { nodeId: "3", handlePosition: "top" },
      );

      cy.getByTestId("toast").should("not.be.visible");

      cy.connectNodes(
        { nodeId: "1", handlePosition: "bottom" },
        { nodeId: "3", handlePosition: "top" },
      );

      cy.getByTestId("toast").should("not.be.visible");

      cy.checkStoreSize([
        { storageKey: consts.STORAGE_KEYS.EDGES, expectedSize: 3 },
      ]);
    });

    it("doesn't allow circular dependencies between 2 nodes", () => {
      cy.mount(<App />);

      cy.checkEmptyStore();

      cy.createNewNodes([
        { name: "Mobility", description: "Movement" },
        { name: "Agility", description: "Speed" },
      ]);

      cy.zoomOut();

      cy.moveNode("2", 200, 200);

      cy.connectNodes(
        { nodeId: "1", handlePosition: "bottom" },
        { nodeId: "2", handlePosition: "top" },
      );

      cy.getByTestId("toast").should("not.be.visible");

      cy.connectNodes(
        { nodeId: "2", handlePosition: "bottom" },
        { nodeId: "1", handlePosition: "top" },
      );

      cy.getByTestId("toast").should("be.visible");

      cy.checkStoreSize([
        { storageKey: consts.STORAGE_KEYS.EDGES, expectedSize: 1 },
      ]);
    });

    it("doesn't allow circular dependencies between 3 nodes", () => {
      cy.mount(<App />);

      cy.checkEmptyStore();

      cy.createNewNodes([
        { name: "Mobility", description: "Movement" },
        { name: "Agility", description: "Speed" },
        { name: "Capability", description: "Competence" },
      ]);

      cy.zoomOut();

      cy.moveNode("3", 0, 400);
      cy.moveNode("2", 200, 200);

      cy.connectNodes(
        { nodeId: "1", handlePosition: "bottom" },
        { nodeId: "2", handlePosition: "top" },
      );

      cy.getByTestId("toast").should("not.be.visible");

      cy.connectNodes(
        { nodeId: "2", handlePosition: "bottom" },
        { nodeId: "3", handlePosition: "top" },
      );

      cy.getByTestId("toast").should("not.be.visible");

      cy.connectNodes(
        { nodeId: "3", handlePosition: "bottom" },
        { nodeId: "1", handlePosition: "top" },
      );

      cy.getByTestId("toast").should("be.visible");

      cy.checkStoreSize([
        { storageKey: consts.STORAGE_KEYS.EDGES, expectedSize: 2 },
      ]);
    });

    it("doesn't allow circular dependencies between 4 nodes", () => {
      cy.mount(<App />);

      cy.checkEmptyStore();

      cy.createNewNodes([
        { name: "Mobility", description: "Movement" },
        { name: "Agility", description: "Speed" },
        { name: "Capability", description: "Competence" },
        { name: "Ability", description: "Skill" },
      ]);

      cy.zoomOut();

      cy.moveNode("4", -200, 200);
      cy.moveNode("3", 0, 400);
      cy.moveNode("2", 200, 200);

      cy.connectNodes(
        { nodeId: "1", handlePosition: "bottom" },
        { nodeId: "2", handlePosition: "top" },
      );

      cy.getByTestId("toast").should("not.be.visible");

      cy.connectNodes(
        { nodeId: "2", handlePosition: "bottom" },
        { nodeId: "3", handlePosition: "top" },
      );

      cy.getByTestId("toast").should("not.be.visible");

      cy.connectNodes(
        { nodeId: "3", handlePosition: "bottom" },
        { nodeId: "4", handlePosition: "top" },
      );

      cy.getByTestId("toast").should("not.be.visible");

      cy.connectNodes(
        { nodeId: "4", handlePosition: "bottom" },
        { nodeId: "1", handlePosition: "top" },
      );

      cy.getByTestId("toast").should("be.visible");

      cy.checkStoreSize([
        { storageKey: consts.STORAGE_KEYS.EDGES, expectedSize: 3 },
      ]);
    });

    it("doesn't allow circular dependencies between 3 nodes, with other nodes also in the chain", () => {
      cy.mount(<App />);

      cy.checkEmptyStore();

      cy.createNewNodes([
        { name: "Mobility", description: "Movement" },
        { name: "Agility", description: "Speed" },
        { name: "Capability", description: "Competence" },
        { name: "Ability", description: "Skill" },
      ]);

      cy.zoomOut();

      cy.moveNode("4", -200, 200);
      cy.moveNode("3", 0, 400);
      cy.moveNode("2", 200, 200);

      cy.connectNodes(
        { nodeId: "1", handlePosition: "bottom" },
        { nodeId: "2", handlePosition: "top" },
      );

      cy.getByTestId("toast").should("not.be.visible");

      cy.connectNodes(
        { nodeId: "2", handlePosition: "bottom" },
        { nodeId: "3", handlePosition: "top" },
      );

      cy.getByTestId("toast").should("not.be.visible");

      cy.connectNodes(
        { nodeId: "3", handlePosition: "bottom" },
        { nodeId: "4", handlePosition: "top" },
      );

      cy.getByTestId("toast").should("not.be.visible");

      cy.connectNodes(
        { nodeId: "3", handlePosition: "bottom" },
        { nodeId: "1", handlePosition: "top" },
      );

      cy.getByTestId("toast").should("be.visible");

      cy.checkStoreSize([
        { storageKey: consts.STORAGE_KEYS.EDGES, expectedSize: 3 },
      ]);
    });
  });
});
