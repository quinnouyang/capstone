import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";

import { createWithEqualityFn } from "zustand/traditional";
import { type AudioTrackNode } from "./components/AudioTrackNode";
import { INIT_EDGES, INIT_NODES } from "./components/consts";
import { toggleCtxState } from "./engine/core";

export type AppState = {
  nodes: AudioTrackNode[];
  edges: Edge[];
  nodeCount: number;
  edgeCount: number;

  isPlaying: boolean;

  getNode: (id: string) => AudioTrackNode;
  getEdge: (id: string) => Edge;
  addNodes: (nodes: AudioTrackNode | AudioTrackNode[]) => void;
  addEdges: (edges: Edge[]) => void;
  addEdge: (edge: Edge | Connection) => void;

  onNodesChange: OnNodesChange<AudioTrackNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;

  updateNodeData: (id: string, data: AudioTrackNode["data"]) => void;
  refreshCounts: () => void;

  togglePlay: () => void;
};

/**
 * Custom `useStore`: https://reactflow.dev/api-reference/hooks/use-store.
 *
 * Global state, excluding a few that require hooks (e.g. `useReactFlow`)
 */
const useCustomStore = createWithEqualityFn<AppState>((set, get) => ({
  nodes: INIT_NODES,
  edges: INIT_EDGES,
  nodeCount: INIT_NODES.length,
  edgeCount: INIT_EDGES.length,

  isPlaying: false,

  getNode: (id) => {
    const node = get().nodes.find((n) => n.id === id);
    if (!node) throw Error(`Could not find node of ID ${id}`);
    return node;
  },
  getEdge: (id) => {
    const edge = get().edges.find((e) => e.id === id);
    if (!edge) throw Error(`Could not find edge of ID ${id}`);
    return edge;
  },
  addNodes: (nodes) => {
    set({ nodes: get().nodes.concat(nodes) });
    get().refreshCounts();
  },
  addEdges: (edges) => {
    set({ edges: get().edges.concat(edges) });
    get().refreshCounts();
  },
  addEdge: (edge) => {
    set({ edges: addEdge(edge, get().edges) });
    get().refreshCounts();
  },

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
    get().refreshCounts();
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
    get().refreshCounts();
  },
  onConnect: (connection) => {
    get().addEdge(connection);
    get().refreshCounts();
  },

  updateNodeData(id, data) {
    set({
      nodes: get().nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node,
      ),
    });
  },
  refreshCounts: () => {
    set({
      nodeCount: get().nodes.length,
      edgeCount: get().edges.length,
    });
  },

  togglePlay: () => {
    set({ isPlaying: !get().isPlaying });
    toggleCtxState();
  },
}));

export default useCustomStore;
