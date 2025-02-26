import { ChangeEvent, MouseEvent, useState } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  MiniMap,
  Controls,
  Node,
  Edge,
  Position,
  useReactFlow,
  XYPosition,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import AudioTrackNode, { AudioTrackNodeData } from "./AudioTrackNode";

function initEmptyNode(
  n: number,
  position?: XYPosition,
): Node<AudioTrackNodeData> {
  return {
    id: String(n),
    type: "audioTrackNode",
    data: {
      label: `Audio Track ${String(n)}`,
    },
    position: position ?? { x: n * 400, y: 0 }, // [TODO] Un-hard code
    sourcePosition: Position.Left,
    targetPosition: Position.Right,
  };
}

const NodeCanvas = () => {
  const [count, setCount] = useState(1);
  const [nodes, setNodes, onNodesChange] = useNodesState<
    Node<AudioTrackNodeData>
  >([supplyOnChange(initEmptyNode(1))]); // [TODO] Position in center
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments
  const [edges, , onEdgesChange] = useEdgesState<Edge>([]);
  const { addNodes } = useReactFlow<Node<AudioTrackNodeData>>();

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
  function onPaneClick(e: MouseEvent) {
    addNodes(
      supplyOnChange(initEmptyNode(count + 1, { x: e.clientX, y: e.clientY })),
    );
    setCount((count) => ++count);
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onPaneClick={onPaneClick}
      nodeTypes={{
        audioTrackNode: AudioTrackNode,
      }}
      // fitView
      proOptions={{ hideAttribution: true }}
      style={{ backgroundColor: "white" }}
    >
      <MiniMap />
      <Controls style={{ color: "gray" }} />
    </ReactFlow>
  );
};

export default NodeCanvas;
