import { useCallback, useEffect, useRef, useState } from "react";

import {
  addEdge,
  Background,
  Controls,
  Edge,
  MiniMap,
  OnConnect,
  OnConnectEnd,
  Panel,
  ReactFlow,
  SelectionMode,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type ColorMode as FlowColorMode,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import {
  ColorModeButton,
  useColorMode as useChakraColorMode,
} from "./ui/color-mode";

import { initNode, type AudioTrackNode } from "./AudioTrackNode";
import { INIT_EDGES, INIT_NODES, NODE_TYPES } from "./consts";
import DevTools from "./debug/Devtools";

// [TODO] Debug redundant render console.logs
export default function NodeCanvas() {
  const ref = useRef<HTMLDivElement>(null);

  const [nodes, setNodes, onNodesChange] =
    useNodesState<AudioTrackNode>(INIT_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(INIT_EDGES);
  const [nodeCount, setNodeCount] = useState(INIT_NODES.length);
  const [edgeCount, setEdgeCount] = useState(INIT_EDGES.length);
  const { screenToFlowPosition } = useReactFlow<AudioTrackNode>();

  const { colorMode: chakraColorMode } = useChakraColorMode();
  const [flowColorMode, setFlowColorMode] =
    useState<FlowColorMode>(chakraColorMode);

  // Sync Chakra and ReactFlow color modes
  useEffect(() => {
    setFlowColorMode(chakraColorMode);
  }, [chakraColorMode]);

  // Add edge after connecting nodes
  const onConnect = useCallback<OnConnect>(
    (connection) => {
      setEdges((eds) => addEdge(connection, eds));
      setEdgeCount(() => edgeCount + 1);
    },
    [setEdges, addEdge],
  );

  // Create new node and add edge after connecting on empty space: https://reactflow.dev/examples/nodes/add-node-on-edge-drop
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

      setNodes((nds) => nds.concat(node));
      setEdges((eds) =>
        addEdge(
          {
            source,
            target: node.id,
            sourceHandle: "out",
            targetHandle: "in",
          },
          eds,
        ),
      );

      setNodeCount(() => nodeCount + 1);
      setEdgeCount(() => edgeCount + 1);
    },
    [screenToFlowPosition, setNodes, setEdges, addEdge],
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
