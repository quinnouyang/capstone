import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Edge,
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

  setNodes: (nodes: AudioTrackNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNodes: (nodes: AudioTrackNode[]) => void;
  addEdges: (edges: Edge[]) => void;
  increaseNodeCount: () => void;
  increaseEdgeCount: () => void;

  onNodesChange: OnNodesChange<AudioTrackNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;

  updateNode: (id: string, data: AudioTrackNode["data"]) => void;
};

/**
 * Custom `useStore`: https://reactflow.dev/api-reference/hooks/use-store.
 */
const useCustomStore = createWithEqualityFn<AppState>((set, get) => ({
  nodes: INIT_NODES,
  edges: INIT_EDGES,
  nodeCount: INIT_NODES.length,
  edgeCount: INIT_EDGES.length,

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
    get().increaseEdgeCount();
  },
  setNodes: (nodes) => {
    set({ nodes });
  },
  setEdges: (edges) => {
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
  addNodes: (nodes) => {
    set({ nodes: get().nodes.concat(nodes) });
  },
  addEdges: (edges) => {
    set({ edges: get().edges.concat(edges) });
  },
  updateNode(id, data) {
    set({
      nodes: get().nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node,
      ),
    });
  },
}));

export default useCustomStore;
