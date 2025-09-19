import { type FC } from "react";
import "./InvalidToast.css";

const InvalidToast: FC = () => {
  return (
    <div className="toast-container" data-testid="toast-container">
      <div id="toast" data-testid="toast">
        Connection is invalid - cannot create circular dependency.
      </div>
    </div>
  );
};

export default InvalidToast;
