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

export type AppState = {
  // ReactFlow
  nodes: AudioTrackNode[];
  edges: Edge[];
  nodeCount: number;
  edgeCount: number;

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
  getOutputNodes: (id: string) => AudioTrackNode[];

  // Audio
  ctx: AudioContext;
  isPlaying: boolean;
  togglePlay: () => void;
  createAudioNodeSource: (el: HTMLAudioElement) => void;
  play: (id: string) => void;
  nodeIdToEl: Map<string, HTMLAudioElement>;
};

/**
 * Custom `useStore`: https://reactflow.dev/api-reference/hooks/use-store.
 *
 * Global state, excluding a few that require hooks (e.g. `useReactFlow`)
 */
const useCustomStore = createWithEqualityFn<AppState>((set, get) => ({
  // ReactFlow
  nodes: INIT_NODES,
  edges: INIT_EDGES,
  nodeCount: INIT_NODES.length,
  edgeCount: INIT_EDGES.length,

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
  getOutputNodes: (id) => {
    return get()
      .edges.filter((e) => e.source === id)
      .map((e) => get().getNode(e.target));
  },

  // Audio
  ctx: new AudioContext(), // [Decide] Init as suspended?

  isPlaying: false,
  togglePlay: () => {
    set({ isPlaying: !get().isPlaying });
    const ctx = get().ctx;
    ctx.state === "suspended" ? ctx.resume() : ctx.suspend();
  },
  createAudioNodeSource: (el) => {
    if (get().nodeIdToEl.has(el.id))
      return console.warn("Audio source already exists", el.id);

    const srcNode = get().ctx.createMediaElementSource(el);
    srcNode.connect(get().ctx.destination);
    get().nodeIdToEl.set(el.id, el);
  },
  play: (id) => {
    const srcNode = get().nodeIdToEl.get(id);
    if (!srcNode) return console.warn("Could not find audio source", id);
    srcNode.currentTime = 0;
    srcNode.play();
  },
  nodeIdToEl: new Map<string, HTMLAudioElement>(),
}));

export default useCustomStore;
