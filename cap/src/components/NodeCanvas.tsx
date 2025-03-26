import { ChangeEvent, MouseEvent, useCallback, useRef } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  MiniMap,
  Controls,
  Node,
  Edge,
  // Position,
  useReactFlow,
  XYPosition,
  addEdge,
  NodeOrigin,
  OnConnectEnd,
  OnConnect,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import AudioTrackNode, { AudioTrackNodeData } from "./AudioTrackNode";

const NODE_ORIGIN: NodeOrigin = [0.5, 0];

function initEmptyNode(
  n: number,
  position: XYPosition,
): Node<AudioTrackNodeData> {
  return {
    id: String(n),
    type: "audioTrackNode",
    data: { label: `Audio Track ${String(n)}` },
    position: position,
    // sourcePosition: Position.Left,
    // targetPosition: Position.Right,
    origin: NODE_ORIGIN,
  };
}

let count = 1;

export default function NodeCanvas() {
  const ref = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<
    Node<AudioTrackNodeData>
  >([supplyOnChange(initEmptyNode(1, { x: 0, y: 0 }))]); // [TODO] Position in center
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
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
      supplyOnChange(initEmptyNode(++count, { x: e.clientX, y: e.clientY })),
    );
  }

  const onConnect = useCallback<OnConnect>(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  const onConnectEnd = useCallback<OnConnectEnd>(
    (event, connectionState) => {
      // Skip if connection ends on a node (isValid) or does not originate from a node
      if (connectionState.isValid || !connectionState.fromNode) {
        console.log("Skipping!");
        return;
      }

      const id = connectionState.fromNode.id;
      ++count;

      const { clientX, clientY } =
        "changedTouches" in event ? event.changedTouches[0] : event;

      setNodes((nds) =>
        nds.concat(
          initEmptyNode(
            count,
            screenToFlowPosition({
              x: clientX,
              y: clientY,
            }),
          ),
        ),
      );

      setEdges((eds) =>
        eds.concat({
          id: String(count),
          source: id,
          target: String(count),
        }),
      );

      console.log(
        count,
        nodes.map((n) => n.id),
        edges.map((e) => e.id),
      );
    },
    [screenToFlowPosition, setNodes, setEdges],
  );

  return (
    <ReactFlow
      ref={ref}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onConnectEnd={onConnectEnd}
      // onPaneClick={onPaneClick}
      nodeTypes={{
        audioTrackNode: AudioTrackNode,
      }}
      fitView
      panOnScroll
      selectionOnDrag
      zoomOnDoubleClick={false}
      proOptions={{ hideAttribution: true }}
      style={{ backgroundColor: "white" }}
    >
      <MiniMap />
      <Controls style={{ color: "gray" }} />
    </ReactFlow>
  );
}
