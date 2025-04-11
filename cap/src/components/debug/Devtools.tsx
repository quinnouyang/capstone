import { Panel } from "@xyflow/react";
import {
  useState,
  type Dispatch,
  type HTMLAttributes,
  type ReactNode,
  type SetStateAction,
} from "react";
import "./index.css";

import ChangeLogger from "./ChangeLogger";
import EdgeInspector from "./EdgeInspector";
import NodeInspector from "./NodeInspector";
import ViewportLogger from "./ViewportLogger";

export default function DevTools() {
  const [nodeInspectorActive, setNodeInspectorActive] = useState(true);
  const [edgeInspectorActive, setEdgeInspectorActive] = useState(true);
  const [changeLoggerActive, setChangeLoggerActive] = useState(false);
  const [viewportLoggerActive, setViewportLoggerActive] = useState(true);

  return (
    <div className="react-flow__devtools">
      <Panel position="top-left">
        <DevToolButton
          setActive={setNodeInspectorActive}
          active={nodeInspectorActive}
          title="Toggle Node Inspector"
        >
          Node Inspector
        </DevToolButton>
        <DevToolButton
          setActive={setEdgeInspectorActive}
          active={edgeInspectorActive}
          title="Toggle Edge Inspector"
        >
          Edge Inspector
        </DevToolButton>
        <DevToolButton
          setActive={setChangeLoggerActive}
          active={changeLoggerActive}
          title="Toggle Change Logger"
        >
          Change Logger
        </DevToolButton>
        <DevToolButton
          setActive={setViewportLoggerActive}
          active={viewportLoggerActive}
          title="Toggle Viewport Logger"
        >
          Viewport Logger
        </DevToolButton>
      </Panel>
      {changeLoggerActive && <ChangeLogger />}
      {nodeInspectorActive && <NodeInspector />}
      {edgeInspectorActive && <EdgeInspector />}
      {viewportLoggerActive && <ViewportLogger />}
    </div>
  );
}

function DevToolButton({
  active,
  setActive,
  children,
  ...rest
}: {
  active: boolean;
  setActive: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
} & HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      onClick={() => setActive((a) => !a)}
      className={active ? "active" : ""}
      {...rest}
    >
      {children}
    </button>
  );
}
