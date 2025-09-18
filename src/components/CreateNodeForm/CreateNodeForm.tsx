import { useState, type FC } from "react";
import { type Node, Panel, useNodes } from "@xyflow/react";
import "./CreateNodeForm.css";
import { capitaliseFirstLetter } from "../../utils/generalUtils";
import consts from "../../constants/consts";

interface ICreateNodeForm {
  createNode: (node: Node) => void;
}

const validateFields = (ids: string[]) => {
  let isValid = true;
  const failMessges: string[] = [];
  const values: Record<string, string> = {};

  ids.forEach((id) => {
    const inputField = document.getElementById(id) as HTMLInputElement;
    values[id] = inputField.value;
    const isFieldValid = inputField.checkValidity();
    if (!isFieldValid) {
      const capitalisedId = capitaliseFirstLetter(id);
      isValid = false;
      failMessges.push(`${capitalisedId} field is invalid.`);
    }
  });
  if (!isValid) {
    alert(failMessges.join("\n"));
  }
  return { isValid, values };
};

const CreateNodeForm: FC<ICreateNodeForm> = ({ createNode }) => {
  const [addMenuOpen, setAddMenuOpen] = useState<boolean>(false);

  const nodes = useNodes();

  const addNewNode = () => {
    const { isValid, values } = validateFields([
      consts.SKILL_FIELDS.NAME,
      consts.SKILL_FIELDS.DESCRIPTION,
      consts.SKILL_FIELDS.COST,
    ]);

    if (!isValid) {
      return;
    }

    const name = values[consts.SKILL_FIELDS.NAME];
    const description = values[consts.SKILL_FIELDS.DESCRIPTION];
    const cost = values[consts.SKILL_FIELDS.COST];

    const newNode: Node = {
      id: (nodes.length + 1).toString(),
      type: "skillNode",
      position: { x: 0, y: 0 },
      data: { name, description, cost },
    };
    createNode(newNode);
  };

  return (
    <Panel position="top-left">
      {addMenuOpen ? (
        <div className="createNodeForm">
          <div className="form">
            <label htmlFor={consts.SKILL_FIELDS.NAME}>
              Name (15 characters max):{" "}
            </label>
            <input
              type="text"
              id={consts.SKILL_FIELDS.NAME}
              name={consts.SKILL_FIELDS.NAME}
              placeholder="Enter a name for your skill..."
              required
              size={30}
              maxLength={15}
            />
            <br />
            <label htmlFor={consts.SKILL_FIELDS.DESCRIPTION}>
              Description:{" "}
            </label>
            <input
              type="text"
              id={consts.SKILL_FIELDS.DESCRIPTION}
              name={consts.SKILL_FIELDS.DESCRIPTION}
              placeholder="Enter a description for your skill..."
              required
              size={30}
            />
            <br />
            <label htmlFor={consts.SKILL_FIELDS.COST}>Cost (optional): </label>
            <input
              type="number"
              id={consts.SKILL_FIELDS.COST}
              name={consts.SKILL_FIELDS.COST}
              placeholder="Enter a cost for your skill..."
              size={30}
            />
            <input
              className="addButton"
              type="submit"
              value="Add Skill"
              onClick={() => addNewNode()}
            />
          </div>
          <button onClick={() => setAddMenuOpen(false)}>×</button>
        </div>
      ) : (
        <button onClick={() => setAddMenuOpen(true)}>Add Skill</button>
      )}
    </Panel>
  );
};

export default CreateNodeForm;
