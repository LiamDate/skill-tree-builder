import { Panel, useNodesData } from "@xyflow/react";
import { useMemo, type FC } from "react";
import { capitaliseFirstLetter } from "../../utils/generalUtils";
import "./SkillInformationPanel.css";

interface ISkillInformationPanel {
  id: string;
  showInfo: boolean;
  setShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Panel component that displays the information for a selected skill
 * @typedef {object} ISkillInformationPanel
 * @property {string} id - ID of the selected node.
 * @property {boolean} showInfo - Whether the panel should be shown or not.
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setShowInfo - Setter that closes the panel.
 *
 * @param {ISkillInformationPanel} props - The props for the skill information panel component.
 * @returns {FC} The skill information panel component.
 */
const SkillInformationPanel: FC<ISkillInformationPanel> = ({
  id,
  showInfo,
  setShowInfo,
}) => {
  // Gets the node data and converts it to a useable format
  const nodeData = useNodesData(id)?.data;
  const entries = useMemo(() => {
    if (nodeData) {
      return Object.entries(nodeData);
    }
  }, [nodeData]);

  return (
    <Panel position="top-right">
      {showInfo && (
        <div className="info-panel" data-testid="skill-information-panel">
          {entries?.map((entry) => (
            <div key={entry[0]} data-testid={`skill-field-${entry[0]}`}>
              {capitaliseFirstLetter(entry[0])}: {entry[1] as string}
            </div>
          ))}
          <button
            onClick={() => setShowInfo(false)}
            data-testid="close-skill-information-button"
          >
            ×
          </button>
        </div>
      )}
    </Panel>
  );
};

export default SkillInformationPanel;
