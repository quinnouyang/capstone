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

import { useShallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import { type AudioClipNodeType } from "./components/AudioClipNode/types";
import { INIT_EDGES, INIT_NODES } from "./components/consts";

export type State = {
  /**
   * Graph
   */
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

  /**
   * Web Audio API
   */
  ctx: AudioContext;
  isPlaying: boolean;
  nodeIdToSrcNode: Map<string, MediaElementAudioSourceNode>;
  currTime: number;
  totalTime: number;

  togglePlay: () => void;
  createAudioNodeSource: (el: HTMLAudioElement) => MediaElementAudioSourceNode;
  play: (id: string) => void;
  setCurrTime: (time: number) => void;
  setTotalTime: (time: number) => void;
};

/**
 * Custom `useStore`: https://reactflow.dev/api-reference/hooks/use-store, https://zustand.docs.pmnd.rs/apis/create-with-equality-fn#signature
 *
 * Global state, excluding a few that require hooks (e.g. `useReactFlow`)
 */
const useCustomStore = createWithEqualityFn<State>()(
  // devtools(
  (set, get) => {
    const ctx = new AudioContext();
    ctx.suspend();

    return {
      /**
       * ReactFlow
       */
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
            node.id === id
              ? { ...node, data: { ...node.data, ...data } }
              : node,
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

      /**
       * Audio
       */
      ctx,
      isPlaying: false,
      nodeIdToSrcNode: new Map<string, MediaElementAudioSourceNode>(),
      currTime: 0,
      totalTime: 0,

      togglePlay: () => {
        set({ isPlaying: !get().isPlaying });
        const ctx = get().ctx;
        ctx.state === "suspended" ? ctx.resume() : ctx.suspend();
        const firstId = get().nodes.at(0)?.id;
        if (firstId) get().play(firstId);
      },
      createAudioNodeSource: (el) => {
        if (get().nodeIdToSrcNode.has(el.id)) {
          console.warn("Audio source already exists", el.id);
          return get().nodeIdToSrcNode.get(el.id)!;
        }

        const srcNode = get().ctx.createMediaElementSource(el);
        srcNode.connect(get().ctx.destination);

        // https://zustand.docs.pmnd.rs/guides/maps-and-sets-usage (Necessary?)
        set(({ nodeIdToSrcNode: nodeIdToEl }) => ({
          nodeIdToSrcNode: new Map(nodeIdToEl).set(el.id, srcNode),
        }));

        return srcNode;
      },
      play: (id) => {
        const srcNode = get().getNode(id).data.srcNode?.mediaElement;
        if (!srcNode) return console.warn("Could not find audio source", id);
        srcNode.currentTime = 0;
        srcNode.play();
      },
      setCurrTime: (time) => {
        set({ currTime: time });
      },
      setTotalTime: (time) => {
        set({ totalTime: time });
      },
    };
  },
  //   {
  //     // [PATCH] Redux DevTools can't serialize BigInt: https://github.com/reduxjs/redux-devtools/issues/1541
  //     serialize: {
  //       replacer: (_key: string, value: any) => {
  //         return typeof value === "bigint" ? value.toString() : value;
  //       },
  //     },
  //     // stateSanitizer: (state) =>
  //     //   state.data ? { ...state, data: "<<LONG_BLOB>>" } : state,
  //   },
  // ),
);

export default function useShallowStore<T>(selector: (state: State) => T): T {
  return useCustomStore(useShallow(selector));
}
