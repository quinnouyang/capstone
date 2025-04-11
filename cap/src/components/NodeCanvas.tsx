import { useCallback, useEffect, useRef, useState } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  MiniMap,
  Controls,
  Edge,
  useReactFlow,
  addEdge,
  OnConnectEnd,
  OnConnect,
  SelectionMode,
  Background,
  Panel,
  type ColorMode as FlowColorMode,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import AudioTrackNodeComponent, {
  initNode,
  AudioTrackNode,
} from "./AudioTrackNode";
import {
  ColorModeButton,
  useColorMode as useChakraColorMode,
} from "./ui/color-mode";
import DevTools from "./debug/Devtools";
import { genCountableId } from "./utils";

let nodeCount = 2;
let edgeCount = 1;

const INIT_NODES: AudioTrackNode[] = [
  initNode(0, { x: 0, y: 0 }),
  initNode(1, { x: 800, y: 200 }),
];

const NODE_TYPES = {
  audioTrackNode: AudioTrackNodeComponent,
};

// [TODO] Debug redundant render console.logs
export default function NodeCanvas() {
  const ref = useRef<HTMLDivElement>(null);

  const [nodes, setNodes, onNodesChange] =
    useNodesState<AudioTrackNode>(INIT_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([
    {
      id: genCountableId(edgeCount - 1, "edge"),
      source: nodes[0].id,
      target: nodes[1].id,
    },
  ]);
  const { screenToFlowPosition } = useReactFlow<AudioTrackNode>();

  const { colorMode: chakraColorMode } = useChakraColorMode();
  const [flowColorMode, setFlowColorMode] =
    useState<FlowColorMode>(chakraColorMode);

  useEffect(() => {
    setFlowColorMode(chakraColorMode);
  }, [chakraColorMode]);

  const onConnect = useCallback<OnConnect>(
    (connection) => {
      edgeCount++;

      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            id: genCountableId(edgeCount - 1, "edge"),
          },
          eds,
        ),
      );
    },
    [setEdges, addEdge],
  );

  // Drag-and-drop to create a new node
  const onConnectEnd = useCallback<OnConnectEnd>(
    (event, connectionState) => {
      // Skip if connection ends on a node (isValid) or no connection is in process (somehow)
      if (connectionState.isValid || !connectionState.fromNode) return;

      ++nodeCount;

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

      setNodes((nds) => nds.concat(node));
      setEdges((eds) =>
        addEdge(
          {
            id: genCountableId(edgeCount - 1, "edge"),
            source,
            target: node.id,
          },
          eds,
        ),
      );
    },
    [screenToFlowPosition, setEdges, addEdge],
  );

  return (
    <ReactFlow
      ref={ref}
      colorMode={flowColorMode}
      nodes={nodes}
      edges={edges}
      fitView
      fitViewOptions={{ maxZoom: 1 }}
      onNodesChange={onNodesChange}
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
      <MiniMap />
      <Controls style={{ color: "gray" }} />
      <Background />
      <DevTools />
    </ReactFlow>
  );
}
