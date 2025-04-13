import { Panel, useEdges, useNodes } from "@xyflow/react";
import {
  useState,
  type Dispatch,
  type HTMLAttributes,
  type ReactNode,
  type SetStateAction,
} from "react";
import "./index.css";

import type { AudioTrackNode } from "../AudioTrackNode";
import ChangeLogger from "./ChangeLogger";
import EdgeInspector from "./EdgeInspector";
import NodeInspector from "./NodeInspector";
import ViewportLogger from "./ViewportLogger";

export default function DevTools() {
  const [changeLoggerActive, setChangeLoggerActive] = useState(false);
  const [nodeInspectorActive, setNodeInspectorActive] = useState(true);
  const [edgeInspectorActive, setEdgeInspectorActive] = useState(true);
  const [viewportLoggerActive, setViewportLoggerActive] = useState(true);
  const [nodesStateActive, setNodesStateActive] = useState(false);
  const [edgesStateActive, setEdgesStateActive] = useState(false);

  const nodes = useNodes<AudioTrackNode>();
  const edges = useEdges();

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
          setActive={setNodesStateActive}
          active={nodesStateActive}
          title="Toggle Nodes State"
        >
          Nodes State
        </DevToolButton>
        <DevToolButton
          setActive={setEdgesStateActive}
          active={edgesStateActive}
          title="Toggle Edges State"
        >
          Edges State
        </DevToolButton>
      </Panel>
      {changeLoggerActive && <ChangeLogger />}
      {nodeInspectorActive && <NodeInspector />}
      {edgeInspectorActive && <EdgeInspector />}
      {viewportLoggerActive && <ViewportLogger />}
      <Panel position="top-right">
        {nodesStateActive && (
          <>
            Nodes <pre>{JSON.stringify(nodes, null, 2)}</pre>
          </>
        )}
        {edgesStateActive && (
          <>
            Edges <pre>{JSON.stringify(edges, null, 2)}</pre>
          </>
        )}
      </Panel>
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
