import CreateNodeForm from "../../src/components/CreateNodeForm";

const createNode = () => {};

describe("<CreateNodeForm />", () => {
  it("opens the form when the open form button is clicked", () => {
    cy.mount(<CreateNodeForm createNode={createNode} />);

    cy.openCreateNodeForm();
  });

  it("closes the form when the close form button is clicked", () => {
    cy.mount(<CreateNodeForm createNode={createNode} />);

    cy.openCreateNodeForm();
    cy.getByTestId("close-form-button").click();
    cy.getByTestId("create-node-form").should("not.exist");
  });

  context("which has form validation", () => {
    it("displays an alert with errors if the add button is clicked with no data passed into the fields", () => {
      const createStub = cy.stub();
      const alertStub = cy.stub();
      cy.on("window:alert", alertStub);

      cy.mount(<CreateNodeForm createNode={createStub} />);

      cy.openCreateNodeForm();

      cy.getByTestId("add-skill-button")
        .click()
        .then(() => {
          expect(alertStub.getCall(0)).to.be.calledWith(
            "Name field is invalid.\nDescription field is invalid.",
          );
          expect(createStub).not.to.be.calledWith();
        });
    });

    it("doesn't allow more than 15 characters in the name field", () => {
      const createStub = cy.stub();
      cy.mount(<CreateNodeForm createNode={createStub} />);

      cy.openCreateNodeForm();

      const name = "A test name that is definitely more than 15 characters";

      cy.fillCreateNodeForm({
        name,
        description: "Test description",
        cost: 30,
      });

      cy.getByTestId("name-input-field")
        .invoke("val")
        .then((value) => {
          expect(value).to.equal(name.slice(0, 15));
        });
    });

    it("passes validation if the add button is clicked with valid fields in the form", () => {
      const createStub = cy.stub();
      cy.mount(<CreateNodeForm createNode={createStub} />);

      cy.openCreateNodeForm();

      cy.fillCreateNodeForm({
        name: "Test name",
        description: "Test description",
        cost: 30,
      });

      cy.getByTestId("add-skill-button")
        .click()
        .then(() => {
          expect(createStub).to.be.calledWith();
        });
    });

    it("passes validation even if no cost is entered", () => {
      const createStub = cy.stub();
      cy.mount(<CreateNodeForm createNode={createStub} />);

      cy.openCreateNodeForm();

      cy.fillCreateNodeForm({
        name: "Test name",
        description: "Test description",
      });

      cy.getByTestId("add-skill-button")
        .click()
        .then(() => {
          expect(createStub).to.be.calledWith();
        });
    });
  });
});
