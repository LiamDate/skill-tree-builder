import InvalidToast from "../../src/components/InvalidToast";

describe("<InvalidToast />", () => {
  it("has the correct structure", () => {
    cy.mount(<InvalidToast />);

    cy.getByTestId("toast-container").within(() => cy.getByTestId("toast"));
  });

  it("is invisible by default", () => {
    cy.mount(<InvalidToast />);

    cy.getByTestId("toast").should("have.css", "visibility", "hidden");
    cy.getByTestId("toast").should("not.be.visible");
  });

  it("becomes visible when css property is changed", () => {
    cy.mount(<InvalidToast />);

    cy.getByTestId("toast").then((toast) => {
      toast.addClass("show");
      cy.getByTestId("toast").should("be.visible");
    });
  });

  it("contains the correct text", () => {
    cy.mount(<InvalidToast />);

    cy.getByTestId("toast").then((toast) => {
      toast.addClass("show");
    });

    cy.getByTestId("toast").should(
      "contain",
      "Connection is invalid - cannot create circular dependency.",
    );
  });
});
