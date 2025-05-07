import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Edge,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";
import { StateCreator } from "zustand";
import type { AudioClipNodeType } from "../components/AudioClipNode/utils";
import { INIT_EDGES, INIT_NODES } from "../components/consts";
import type { WebAudioSlice } from "./webAudio";

type State = {
  nodes: AudioClipNodeType[];
  edges: Edge[];
  nodeCount: number;
  edgeCount: number;

  idToNodes: Map<string, AudioClipNodeType>;
  idToEdges: Map<string, Edge>;
};

type Functions = {
  getNode: (id: string) => AudioClipNodeType;
  getEdge: (id: string) => Edge;
  addNodes: (nodes: AudioClipNodeType[]) => void;
  addEdges: (edges: Edge[]) => void;

  onNodesChange: OnNodesChange<AudioClipNodeType>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;

  updateNodeInfo: (id: string, data: AudioClipNodeType["data"]) => void;
  refreshCounts: () => void;
  getOutputNodes: (id: string) => AudioClipNodeType[];
};

export type ReactFlowSlice = State & Functions;

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
  idToNodes: new Map(INIT_NODES.map((node) => [node.id, node])),
  idToEdges: new Map(INIT_EDGES.map((edge) => [edge.id, edge])),

  getNode: (id) => {
    const node = get().idToNodes.get(id);
    if (!node) throw Error(`Could not find node of ID ${id}`);
    return node;
  },
  getEdge: (id) => {
    const edge = get().idToEdges.get(id);
    if (!edge) throw Error(`Could not find edge of ID ${id}`);
    return edge;
  },
  addNodes: (nodes) => {
    const newIdToNodes = new Map(get().idToNodes);
    nodes.forEach((node) => {
      newIdToNodes.set(node.id, node);
    });
    set({ nodes: Array.from(newIdToNodes.values()) });
    set({
      idToNodes: newIdToNodes,
    });
    get().refreshCounts();
  },
  addEdges: (edges) => {
    const newIdToEdges = new Map(get().idToEdges);
    edges.forEach((edge) => {
      newIdToEdges.set(edge.id, edge);
    });
    set({ edges: Array.from(newIdToEdges.values()) });
    set({
      idToEdges: newIdToEdges,
    });
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
    set({ edges: addEdge(connection, get().edges) });
    const newEdge = get().edges[-1];
    set({
      idToEdges: new Map(get().idToEdges).set(newEdge.id, newEdge),
    });
    get().refreshCounts();
  },

  // https://reactflow.dev/examples/nodes/update-node, https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications#using_object_urls
  updateNodeInfo(id, data) {
    set({
      nodes: get().nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node,
      ),
    });
    set({
      idToNodes: new Map(get().idToNodes).set(id, {
        ...get().getNode(id),
        data: { ...get().getNode(id).data, ...data },
      }),
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
