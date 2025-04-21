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
import StoreInspector from "./StoreInspector";
import ViewportLogger from "./ViewportLogger";

export default function DevTools() {
  const [changeLoggerActive, setChangeLoggerActive] = useState(false);
  const [nodeInspectorActive, setNodeInspectorActive] = useState(false);
  const [edgeInspectorActive, setEdgeInspectorActive] = useState(false);
  const [viewportLoggerActive, setViewportLoggerActive] = useState(false);
  const [storeInspectorActive, setStoreInspectorActive] = useState(false);

  return (
    <div className="react-flow__devtools">
      <Panel position="top-left">
        <DevToolButton
          setActive={setChangeLoggerActive}
          active={changeLoggerActive}
          title="Toggle Change Logger"
        >
          Change Logger
        </DevToolButton>
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
          setActive={setViewportLoggerActive}
          active={viewportLoggerActive}
          title="Toggle Viewport Logger"
        >
          Viewport Logger
        </DevToolButton>
        <DevToolButton
          setActive={setStoreInspectorActive}
          active={storeInspectorActive}
          title="Toggle Store Inspector"
        >
          Store Inspector
        </DevToolButton>
      </Panel>
      {changeLoggerActive && <ChangeLogger />}
      {nodeInspectorActive && <NodeInspector />}
      {edgeInspectorActive && <EdgeInspector />}
      {viewportLoggerActive && <ViewportLogger />}
      {storeInspectorActive && <StoreInspector />}
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
