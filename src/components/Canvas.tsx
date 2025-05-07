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

import { Button } from "@chakra-ui/react";
import { useCallback } from "react";
import useShallowStore, { type State } from "../store/store";
import { initNode } from "./AudioClipNode/utils";
import { NODE_TYPES } from "./consts";
import DevTools from "./debug/Devtools";
import PlayPause from "./PlayPause";
import { useColorMode } from "./ui/color-mode";
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

  devtoolsOpen: s.devtoolsOpen,
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
    devtoolsOpen,
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
      <Panel position="bottom-center">
        <PlayPause />
        <Button onClick={() => addNodes(initNode(nodeCount, { x: 50, y: 50 }))}>
          Add Node
        </Button>
      </Panel>
      <MiniMap />
      <Controls />
      <Background />
      {devtoolsOpen && <DevTools />}
    </ReactFlow>
  );
}
