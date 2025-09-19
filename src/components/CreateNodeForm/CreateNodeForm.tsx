import { useState, type FC } from "react";
import { type Node, Panel } from "@xyflow/react";
import { capitaliseFirstLetter } from "../../utils/generalUtils";
import consts from "../../constants/consts";
import "./CreateNodeForm.css";
import { getNodesFromStorage } from "../../utils/storageUtil";

interface ICreateNodeForm {
  createNode: (node: Node) => void;
}

interface IValidateFieldsResult {
  isValid: boolean;
  values: Record<string, string>;
}

/**
 * Validates the input fields in the form.
 * @param {string[]} ids - The IDs of the input elements.
 * @returns {IValidateFieldsResult} An object containing whether the fields are valid, and the values in those fields.
 */
const validateFields = (ids: string[]): IValidateFieldsResult => {
  let isValid = true;
  const failMessges: string[] = [];
  const values: Record<string, string> = {};

  // Loops through the passed in IDs and gets each of their elements
  ids.forEach((id) => {
    const inputField = document.getElementById(id) as HTMLInputElement;
    values[id] = inputField.value;

    // If a field is invalid, add an error message
    const isFieldValid = inputField.checkValidity();
    if (!isFieldValid) {
      const capitalisedId = capitaliseFirstLetter(id);
      isValid = false;
      failMessges.push(`${capitalisedId} field is invalid.`);
    }
  });

  // If any fields are invalid, display the error messages in an alert
  if (!isValid) {
    alert(failMessges.join("\n"));
  }

  return { isValid, values };
};

/**
 * Form component that lets users create new skill nodes.
 * @typedef {object} ICreateNodeForm
 * @property {function(code: Node): void} createNode - Method which adds the new node to the nodes array.
 *
 * @param {ICreateNodeForm} props - The props for the create node form component
 * @returns {FC} The create node form component
 */
const CreateNodeForm: FC<ICreateNodeForm> = ({ createNode }) => {
  const [addMenuOpen, setAddMenuOpen] = useState<boolean>(false);

  /**
   * Checks whether the form passes validation and creates the new node if it does.
   */
  const addNewNode = (): void => {
    const nodes = getNodesFromStorage();

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
        <div className="createNodeForm" data-testid="create-node-form">
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
              data-testid="name-input-field"
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
              data-testid="description-input-field"
            />
            <br />
            <label htmlFor={consts.SKILL_FIELDS.COST}>Cost (optional): </label>
            <input
              type="number"
              id={consts.SKILL_FIELDS.COST}
              name={consts.SKILL_FIELDS.COST}
              placeholder="Enter a cost for your skill..."
              size={30}
              data-testid="cost-input-field"
            />
            <input
              className="addButton"
              type="submit"
              value="Add Skill"
              onClick={() => addNewNode()}
              data-testid="add-skill-button"
            />
          </div>
          <button
            onClick={() => setAddMenuOpen(false)}
            data-testid="close-form-button"
          >
            ×
          </button>
        </div>
      ) : (
        <button
          onClick={() => setAddMenuOpen(true)}
          data-testid="open-form-button"
        >
          Add Skill
        </button>
      )}
    </Panel>
  );
};

export default CreateNodeForm;
