import {
  Background,
  Controls,
  MiniMap,
  OnConnectEnd,
  Panel,
  ReactFlow,
  SelectionMode,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useCallback } from "react";
import useShallowStore, { type State } from "../store";
import { initNode } from "./AudioTrackNode";
import PlayPause from "./PlayPause";
import { NODE_TYPES } from "./consts";
import DevTools from "./debug/Devtools";
import { ColorModeButton, useColorMode } from "./ui/color-mode";
import { genId } from "./utils";

const SELECTOR = (s: State) => ({
  nodes: s.nodes,
  edges: s.edges,
  nodeCount: s.nodeCount,
  edgeCount: s.edgeCount,
  addNodes: s.addNodes,
  addEdges: s.addEdges,
  addEdge: s.addEdge,
  onNodesChange: s.onNodesChange,
  onEdgesChange: s.onEdgesChange,
  onConnect: s.onConnect,
});

export default function Canvas() {
  const {
    nodes,
    edges,
    nodeCount,
    edgeCount,
    addNodes,
    addEdges,
    addEdge,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useShallowStore(SELECTOR);
  const { colorMode } = useColorMode(); // [Bug] Redundant rerender
  const { screenToFlowPosition } = useReactFlow(); // [Bug] Redundant rerender

  const onConnectEnd = useCallback<OnConnectEnd>(
    (event, connectionState) => {
      // Skip if connection ends on a node (isValid) or no connection is in process (somehow)
      if (connectionState.isValid || !connectionState.fromNode) return;

      const { clientX, clientY } =
        "changedTouches" in event ? event.changedTouches[0] : event;

      const node = initNode(
        nodeCount,
        screenToFlowPosition({
          x: clientX,
          y: clientY,
        }),
      );

      const source = connectionState.fromNode.id;

      addNodes(node);
      addEdge({
        id: genId(edgeCount, "edge"),
        source,
        target: node.id,
        sourceHandle: "out",
        targetHandle: "in",
      });
    },
    [nodeCount, edgeCount, addNodes, addEdges, screenToFlowPosition],
  );

  return (
    <ReactFlow
      colorMode={colorMode} // [Bug] Redundant rerender
      nodes={nodes}
      edges={edges}
      fitView
      fitViewOptions={{ maxZoom: 1 }}
      onNodesChange={onNodesChange} // [Bug] Redundant rerender
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onConnectEnd={onConnectEnd}
      nodeTypes={NODE_TYPES}
      panOnScroll
      selectionOnDrag
      selectionMode={SelectionMode.Partial}
      zoomOnDoubleClick={false}
      proOptions={{ hideAttribution: true }}
    >
      <Panel position="top-right">
        <ColorModeButton />
      </Panel>
      <Panel position="bottom-center">
        <PlayPause />
      </Panel>
      <MiniMap />
      <Controls />
      <Background />
      <DevTools />
    </ReactFlow>
  );
}
