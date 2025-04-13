import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type EdgeChange,
  type NodeChange,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";

import { createWithEqualityFn } from "zustand/traditional";
import { type AudioTrackNode } from "./components/AudioTrackNode";
import { INIT_EDGES, INIT_NODES } from "./components/consts";

export type AppState = {
  nodes: AudioTrackNode[];
  edges: Edge[];
  nodeCount: number;
  edgeCount: number;
  onNodesChange: OnNodesChange<AudioTrackNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: AudioTrackNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  increaseNodeCount: () => void;
  increaseEdgeCount: () => void;
  addNodes: (nodes: AudioTrackNode[]) => void;
  addEdges: (edges: Edge[]) => void;
  updateNode: (id: string, data: AudioTrackNode["data"]) => void;
};

/**
 * Custom `useStore`: https://reactflow.dev/api-reference/hooks/use-store.
 */
const useCustomStore = createWithEqualityFn<AppState>(
  (set, get): AppState => ({
    nodes: INIT_NODES,
    edges: INIT_EDGES,
    nodeCount: INIT_NODES.length,
    edgeCount: INIT_EDGES.length,
    onNodesChange: (changes: NodeChange<AudioTrackNode>[]) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes: EdgeChange[]) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection: Connection) => {
      set({
        edges: addEdge(connection, get().edges),
      });
      get().increaseEdgeCount();
    },
    setNodes: (nodes: AudioTrackNode[]) => {
      set({ nodes });
    },
    setEdges: (edges: Edge[]) => {
      set({ edges });
    },
    increaseNodeCount: () => {
      set(({ nodeCount }) => ({
        nodeCount: ++nodeCount,
      }));
    },
    increaseEdgeCount: () => {
      set(({ edgeCount }) => ({
        edgeCount: ++edgeCount,
      }));
    },
    addNodes: (nodes: AudioTrackNode[]) => {
      set({ nodes: get().nodes.concat(nodes) });
    },
    addEdges: (edges: Edge[]) => {
      set({ edges: get().edges.concat(edges) });
    },
    updateNode(id: string, data: AudioTrackNode["data"]) {
      set({
        nodes: get().nodes.map((node) =>
          node.id === id ? { ...node, data: { ...node.data, ...data } } : node,
        ),
      });
    },
  }),
);

export default useCustomStore;
