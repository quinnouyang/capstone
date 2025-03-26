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
  addEdge,
  OnConnectEnd,
  OnConnect,
  SelectionMode,
  type XYPosition,
  type NodeOrigin,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import AudioTrackNode, { AudioTrackNodeData } from "./AudioTrackNode";
import { IconButton } from "@chakra-ui/react";
import { BiPause, BiPlay } from "react-icons/bi";
import { useColorMode } from "./ui/color-mode";

const NODE_ORIGIN: NodeOrigin = [0, 0.5];

// id = count - 1;
let nodeId = 2;
let edgeId = 1;

export default function NodeCanvas() {
  const { colorMode } = useColorMode();

  const ref = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<
    Node<AudioTrackNodeData>
  >([
    initNode("0", { x: 0, y: 0 }),
    initNode("1", { x: 800, y: 200 }),
    initNode("2", { x: 800, y: -200 }),
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([
    { id: "0", source: "0", target: "1" },
    { id: "1", source: "0", target: "2" },
  ]);
  const { addNodes, screenToFlowPosition } = useReactFlow<
    Node<AudioTrackNodeData>,
    Edge
  >();

  function initNode(
    id: string,
    position: XYPosition,
  ): Node<AudioTrackNodeData> {
    return {
      id,
      position,
      data: {
        onInputChange: ({
          target: { files },
        }: ChangeEvent<HTMLInputElement>) => {
          if (!files || !files[0]) return;

          // Update `src` in state of corresponding node
          // See https://reactflow.dev/examples/nodes/update-node
          // and https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications#using_object_urls
          setNodes((nds) =>
            nds.map((n) =>
              n.id === id
                ? {
                    ...n,
                    data: { ...n.data, src: URL.createObjectURL(files[0]) },
                  }
                : n,
            ),
          );
        },
      },
      type: "audioTrackNode",
      origin: NODE_ORIGIN,
    };
  }

  // [TODO] Adjust to canvas resizing and do not register mouse drags
  // @ts-expect-error
  function onPaneClick(e: MouseEvent) {
    addNodes(
      // [TODO] Consider useMousePositlion: https://www.joshwcomeau.com/snippets/react-hooks/use-mouse-position/
      initNode(String(++nodeId), { x: e.clientX, y: e.clientY }),
    );
  }

  const onConnect = useCallback<OnConnect>(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges, addEdge],
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
          initNode(
            String(nodeId),
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
      colorMode={colorMode}
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
