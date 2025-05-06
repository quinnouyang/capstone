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
import { StateCreator } from "zustand";
import type { AudioClipNodeType } from "../components/AudioClipNode/types";
import { INIT_EDGES, INIT_NODES } from "../components/consts";
import type { WebAudioSlice } from "./webAudio";

export type ReactFlowSlice = {
  nodes: AudioClipNodeType[];
  edges: Edge[];
  nodeCount: number;
  edgeCount: number;

  getNode: (id: string) => AudioClipNodeType;
  getEdge: (id: string) => Edge;
  addNodes: (nodes: AudioClipNodeType | AudioClipNodeType[]) => void;
  addEdges: (edges: Edge[]) => void;
  addEdge: (edge: Edge | Connection) => void;

  onNodesChange: OnNodesChange<AudioClipNodeType>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;

  updateNodeData: (id: string, data: AudioClipNodeType["data"]) => void;
  refreshCounts: () => void;
  getOutputNodes: (id: string) => AudioClipNodeType[];
};

export const createReactFlowSlice: StateCreator<
  ReactFlowSlice & WebAudioSlice,
  [],
  [],
  ReactFlowSlice
> = (set, get) => ({
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

  // https://reactflow.dev/examples/nodes/update-node, https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications#using_object_urls
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
});
