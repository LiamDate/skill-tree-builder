import SkillInformationPanel from "../../src/components/SkillInformationPanel";
import { capitaliseFirstLetter } from "../../src/utils/generalUtils";

describe("<SkillInformationPanel />", () => {
  it("is invisible if showInfo is false", () => {
    const setShowInfoStub = cy.stub();
    cy.mountFlowComponent(
      <SkillInformationPanel
        id="nodeId1"
        showInfo={false}
        setShowInfo={setShowInfoStub}
      />,
    );

    cy.getByTestId("skill-information-panel").should("not.exist");
  });

  it("is visible if showInfo is true", () => {
    const setShowInfoStub = cy.stub();
    cy.mountFlowComponent(
      <SkillInformationPanel
        id="nodeId1"
        showInfo={true}
        setShowInfo={setShowInfoStub}
      />,
    );

    cy.getByTestId("skill-information-panel");
  });

  it("triggers setShowInfo if the close button is clicked", () => {
    const setShowInfoStub = cy.stub();
    cy.mountFlowComponent(
      <SkillInformationPanel
        id="nodeId1"
        showInfo={true}
        setShowInfo={setShowInfoStub}
      />,
    );

    cy.getByTestId("skill-information-panel");
    cy.getByTestId("close-skill-information-button")
      .click()
      .then(() => {
        expect(setShowInfoStub).to.be.calledWith();
      });
  });

  it("displays values that are in the store for a given id", () => {
    const setShowInfoStub = cy.stub();

    const dataFields = {
      name: "Speed",
      description: "How fast you can run",
      cost: 55,
    };

    cy.mountFlowComponent(
      <SkillInformationPanel
        id="nodeId1"
        showInfo={true}
        setShowInfo={setShowInfoStub}
      />,
      {
        nodes: [
          {
            id: "nodeId1",
            position: { x: 1, y: 2 },
            data: dataFields,
          },
        ],
      },
    );

    Object.entries(dataFields).forEach((field) => {
      cy.getByTestId(`skill-field-${field[0]}`).should(
        "contain",
        `${capitaliseFirstLetter(field[0])}: ${field[1]}`,
      );
    });
  });
});
