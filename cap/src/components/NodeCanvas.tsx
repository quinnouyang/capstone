import {
  ChangeEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
  Background,
  Panel,
  type ColorMode as FlowColorMode,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import AudioTrackNode, { AudioTrackNodeData } from "./AudioTrackNode";
import {
  ColorModeButton,
  useColorMode as useChakraColorMode,
} from "./ui/color-mode";
import DevTools from "./debug/Devtools";
import { extendId } from "./utils";

let nodeCount = 2;
let edgeCount = 1;

export default function NodeCanvas() {
  const { colorMode: chakraColorMode } = useChakraColorMode();
  const [flowColorMode, setFlowColorMode] =
    useState<FlowColorMode>(chakraColorMode);

  useEffect(() => {
    setFlowColorMode(chakraColorMode);
  }, [chakraColorMode]);

  const ref = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<
    Node<AudioTrackNodeData>
  >([initNode(0, { x: 0, y: 0 }), initNode(1, { x: 800, y: 200 })]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([
    { id: "0", source: nodes[0].id, target: nodes[1].id },
  ]);
  const { addNodes, screenToFlowPosition } = useReactFlow<
    Node<AudioTrackNodeData>,
    Edge
  >();

  function initNode(i: number, position: XYPosition): Node<AudioTrackNodeData> {
    const id = extendId(String(i));

    return {
      id,
      position,
      data: {
        onInputChange: ({
          target: { files },
        }: ChangeEvent<HTMLInputElement>) => {
          if (!files || !files[0]) {
            console.warn("No file selected");
            return;
          }

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
      origin: [0, 0.5],
    };
  }

  // [TODO] Adjust to canvas resizing and do not register mouse drags
  // @ts-expect-error
  function onPaneClick(e: MouseEvent) {
    addNodes(
      // [TODO] Consider useMousePositlion: https://www.joshwcomeau.com/snippets/react-hooks/use-mouse-position/
      initNode(++nodeCount, { x: e.clientX, y: e.clientY }),
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

      ++nodeCount;
      ++edgeCount;

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
        eds.concat({
          id: extendId(String(edgeCount)),
          source,
          target: node.id,
        }),
      );
    },
    [screenToFlowPosition, setNodes, setEdges],
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
