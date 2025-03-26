import { ChangeEvent, MouseEvent, useCallback, useRef } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  MiniMap,
  Controls,
  Node,
  Edge,
  useReactFlow,
  XYPosition,
  addEdge,
  NodeOrigin,
  OnConnectEnd,
  OnConnect,
  SelectionMode,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import AudioTrackNode, { AudioTrackNodeData } from "./AudioTrackNode";

const NODE_ORIGIN: NodeOrigin = [0, 0.5];

function initEmptyNode(
  n: number,
  position: XYPosition,
): Node<AudioTrackNodeData> {
  return {
    id: String(n),
    type: "audioTrackNode",
    data: { label: `Audio Track ${String(n)}` },
    position: position,
    origin: NODE_ORIGIN,
  };
}

// id = count - 1;
let nodeId = 2;
let edgeId = 1;

export default function NodeCanvas() {
  const ref = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<
    Node<AudioTrackNodeData>
  >(
    [
      initEmptyNode(0, { x: 0, y: 0 }),
      initEmptyNode(1, { x: 800, y: 200 }),
      initEmptyNode(2, { x: 800, y: -200 }),
    ].map((n) => supplyOnChange(n)),
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([
    { id: "0", source: "0", target: "1" },
    { id: "1", source: "0", target: "2" },
  ]);
  const { addNodes, screenToFlowPosition } = useReactFlow<
    Node<AudioTrackNodeData>,
    Edge
  >();

  function supplyOnChange(node: Node<AudioTrackNodeData>) {
    return {
      ...node,
      data: {
        ...node.data,
        onChange: (e: ChangeEvent<HTMLInputElement>) => {
          const files = e.target.files;
          if (files === null) return;

          const src = URL.createObjectURL(files[0]);

          setNodes((nds) =>
            nds.map((n) => {
              if (n.id !== node.id) return n;

              return {
                ...n,
                data: {
                  ...n.data,
                  src,
                  label: files[0].name,
                },
              };
            }),
          );
        },
      },
    };
  }

  // [TODO] Adjust to canvas resizing and do not register mouse drags
  // @ts-expect-error
  function onPaneClick(e: MouseEvent) {
    addNodes(
      // [TODO] Consider useMousePositlion: https://www.joshwcomeau.com/snippets/react-hooks/use-mouse-position/
      supplyOnChange(initEmptyNode(++nodeId, { x: e.clientX, y: e.clientY })),
    );
  }

  const onConnect = useCallback<OnConnect>(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  const onConnectEnd = useCallback<OnConnectEnd>(
    (event, connectionState) => {
      // Skip if connection ends on a node (isValid) or no connection is in process (somehow)
      if (connectionState.isValid || !connectionState.fromNode) return;

      const sourceId = connectionState.fromNode.id;

      ++nodeId;
      ++edgeId;

      const { clientX, clientY } =
        "changedTouches" in event ? event.changedTouches[0] : event;

      setNodes((nds) =>
        nds.concat(
          initEmptyNode(
            nodeId,
            screenToFlowPosition({
              x: clientX,
              y: clientY,
            }),
          ),
        ),
      );

      setEdges((eds) =>
        eds.concat({
          id: String(edgeId),
          source: sourceId,
          target: String(nodeId),
        }),
      );
    },
    [screenToFlowPosition, setNodes, setEdges],
  );

  return (
    <ReactFlow
      ref={ref}
      nodes={nodes}
      edges={edges}
      fitView
      fitViewOptions={{ maxZoom: 1 }}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onConnectEnd={onConnectEnd}
      // onPaneClick={onPaneClick}
      nodeTypes={{
        audioTrackNode: AudioTrackNode,
      }}
      panOnScroll
      selectionOnDrag
      selectionMode={SelectionMode.Partial}
      zoomOnDoubleClick={false}
      proOptions={{ hideAttribution: true }}
    >
      <MiniMap />
      <Controls style={{ color: "gray" }} />
    </ReactFlow>
  );
}
