import { Panel, useNodesData } from "@xyflow/react";
import { type FC } from "react";
import { capitaliseFirstLetter } from "../../utils/generalUtils";
import "./SkillInformationPanel.css";

interface ISkillInformationPanel {
  id: string;
  showInfo: boolean;
  setShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

const SkillInformationPanel: FC<ISkillInformationPanel> = ({
  id,
  showInfo,
  setShowInfo,
}) => {
  const nodeData = useNodesData(id)?.data;
  let entries: [string, unknown][] = [];
  if (nodeData) {
    entries = Object.entries(nodeData);
  }

  return (
    <Panel position="center-right">
      {showInfo && (
        <div className="infoPanel">
          {entries.map((entry) => {
            return (
              <div key={entry[0]}>
                {capitaliseFirstLetter(entry[0])}: {entry[1] as string}
              </div>
            );
          })}
          <button onClick={() => setShowInfo(false)}>×</button>
        </div>
      )}
    </Panel>
  );
};

export default SkillInformationPanel;
