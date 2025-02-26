import { useState, useCallback, ChangeEvent } from "react";
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
import ColorSelectorNode from "./ColorSelectorNode";

const initBgColor = "#c9f1dd";
const snapGrid: [number, number] = [20, 20];
const nodeTypes = {
  selectorNode: ColorSelectorNode,
};

const defaultViewport = { x: 0, y: 0, zoom: 1.5 };

const INITIAL_NODES: Node[] = [
  {
    id: "1",
    type: "input",
    data: { label: "An input node" },
    position: { x: 0, y: 50 },
    sourcePosition: Position.Right,
  },
  {
    id: "2",
    type: "selectorNode",
    data: { onChange: undefined, color: initBgColor },
    position: { x: 300, y: 50 },
  },
  {
    id: "3",
    type: "output",
    data: { label: "Output A" },
    position: { x: 650, y: 25 },
    targetPosition: Position.Left,
  },
  {
    id: "4",
    type: "output",
    data: { label: "Output B" },
    position: { x: 650, y: 100 },
    targetPosition: Position.Left,
  },
];

const INITIAL_EDGES: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    animated: true,
  },
  {
    id: "e2a-3",
    source: "2",
    target: "3",
    sourceHandle: "a",
    animated: true,
  },
  {
    id: "e2b-4",
    source: "2",
    target: "4",
    sourceHandle: "b",
    animated: true,
  },
];

const CustomNodeFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);
  const [bgColor, setBgColor] = useState(initBgColor);

  nodes[1].data.onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.type !== "selectorNode") return node;

        const color = event.target.value;
        setBgColor(color);

        return {
          ...node,
          data: {
            ...node.data,
            color,
          },
        };
      }),
    );
  };

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
      style={{ background: bgColor }}
      nodeTypes={nodeTypes}
      snapToGrid={true}
      snapGrid={snapGrid}
      defaultViewport={defaultViewport}
      fitView
      attributionPosition="bottom-left"
    >
      <MiniMap
        nodeStrokeColor={(n) => {
          if (n.type === "input") return "#0041d0";
          if (n.type === "output") return "#ff0072";
          return bgColor;
        }}
        nodeColor={(n) => {
          if (n.type === "selectorNode") return bgColor;
          return "#fff";
        }}
      />
      <Controls />
    </ReactFlow>
  );
};

export default CustomNodeFlow;
