import { Panel, useNodesData } from "@xyflow/react";
import { type FC } from "react";
import "./SkillInformation.css";
import { capitaliseFirstLetter } from "../../utils/generalUtils";

interface ISkillInformation {
  id: string;
  showInfo: boolean;
  setShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

const SkillInformation: FC<ISkillInformation> = ({
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

export default SkillInformation;
