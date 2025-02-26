import { ChangeEvent, useCallback } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
  Node,
  Edge,
  Position,
  Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import AudioTrackNode from "./AudioTrackNode";

const INITIAL_NODES: Node[] = [
  {
    id: "1",
    type: "audioTrackNode",
    data: {
      label: "AUDIO_TRACK_LABEL_1",
      src: "AUDIO_TRACK_SRC_1",
      onChange: undefined,
    },
    position: { x: 0, y: 0 },
    sourcePosition: Position.Left,
    targetPosition: Position.Right,
  },
  {
    id: "2",
    type: "audioTrackNode",
    data: {
      label: "AUDIO_TRACK_LABEL_2",
      src: "AUDIO_TRACK_SRC_2",
      onChange: undefined,
    },
    position: { x: 400, y: 0 },
    sourcePosition: Position.Left,
    targetPosition: Position.Right,
  },
];

const INITIAL_EDGES: Edge[] = [];

const NodeCanvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(
    INITIAL_NODES.map((node) => {
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
    }),
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds: Edge[]) =>
        addEdge<Edge>({ ...params, animated: true }, eds),
      );
    },
    [setEdges],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={{
        audioTrackNode: AudioTrackNode,
      }}
      fitView
      proOptions={{ hideAttribution: true }}
      style={{ backgroundColor: "white" }}
    >
      <MiniMap />
      <Controls style={{ color: "gray" }} />
    </ReactFlow>
  );
};

export default NodeCanvas;
