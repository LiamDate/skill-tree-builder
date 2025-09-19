import SkillHandle from "../../src/components/SkillHandle";
import { Position } from "@xyflow/react";

describe("<SkillHandle />", () => {
  it("renders with the passed in id & position", () => {
    const position = Position.Bottom;
    const id = "1";

    cy.mountFlowComponent(<SkillHandle position={position} id={id} />);

    cy.getByTestId(`skill-handle-${id}-${position}`).should(
      "have.attr",
      "data-handleid",
      id,
    );
    cy.getByTestId(`skill-handle-${id}-${position}`).should(
      "have.attr",
      "data-handlepos",
      position,
    );
  });
});
