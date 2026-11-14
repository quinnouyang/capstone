import { StateCreator } from "zustand";
import type { ReactFlowSlice } from "./reactFlow";

export type AudioClipData = {
  file?: File;
  el: HTMLAudioElement;
  srcNode: MediaElementAudioSourceNode;
};

type State = {
  ctx: AudioContext;
  isPlaying: boolean;
  nodeAudioData: Map<string, AudioClipData>;

  startingNodes: string[];
  enabledNodes: string[];
  duration: number;
};

type Functions = {
  setIsPlaying: (isPlaying: boolean) => void;
  togglePlaying: () => void;
  playNodeEl: (id: string) => void;

  initAudioData: (id: string, el: HTMLAudioElement) => Promise<void>;
  updateAudioData: (id: string, data: Partial<AudioClipData>) => void;
  getAudioData: (id: string) => AudioClipData | undefined;

  addStarting: (id: string) => void;
  addEnabled: (id: string) => void;
  removeStarting: (id: string) => void;
  removeEnabled: (id: string) => void;
  clearStarting: () => void;
  clearEnabled: () => void;

  refreshDuration: (time: number) => void;
};

export type WebAudioSlice = State & Functions;

const sourceNodes = new WeakMap<
  HTMLAudioElement,
  MediaElementAudioSourceNode
>();

export const createWebAudioSlice: StateCreator<
  ReactFlowSlice & WebAudioSlice,
  [],
  [],
  WebAudioSlice
> = (set, get) => {
  const _ctx = new AudioContext();
  _ctx.suspend();

  return {
    ctx: _ctx,
    isPlaying: false,
    nodeAudioData: new Map(),

    startingNodes: [],
    enabledNodes: [],
    duration: 0,

    setIsPlaying: (isPlaying) => {
      set({ isPlaying });
      if (isPlaying) get().ctx.resume();
      else get().ctx.suspend();
    },
    togglePlaying: () => {
      get().setIsPlaying(!get().isPlaying);
      if (!get().isPlaying) return;
      const firstId = get().nodes.at(0)?.id;
      if (firstId) get().playNodeEl(firstId);
    },
    playNodeEl: (id) => {
      const el = get().nodeAudioData.get(id)?.el;
      if (!el) return console.warn("Could not find audio source", id);
      el.play();
    },

    initAudioData: async (id: string, el: HTMLAudioElement) => {
      let srcNode = sourceNodes.get(el);
      if (!srcNode) {
        srcNode = get().ctx.createMediaElementSource(el);
        srcNode.connect(get().ctx.destination);
        sourceNodes.set(el, srcNode);
      }
      const data = { el, srcNode };
      set(({ nodeAudioData }) => ({
        nodeAudioData: new Map(nodeAudioData).set(id, data),
      }));

      if (!el.src) return;
      try {
        const response = await fetch(el.src);
        if (!response.ok) throw Error(`Audio fetch failed: ${response.status}`);
        const file = new File([await response.blob()], "init " + el.src);
        // A file selected during the fetch must win over the initial source.
        if (get().nodeAudioData.get(id) === data) {
          set(({ nodeAudioData }) => ({
            nodeAudioData: new Map(nodeAudioData).set(id, { ...data, file }),
          }));
        }
      } catch (error) {
        console.warn("Could not load initial audio file", id, error);
      }
    },
    updateAudioData: (id: string, data: Partial<AudioClipData>) => {
      const previous = get().nodeAudioData.get(id);
      if (!previous) return;
      const next = { ...previous, ...data };
      if (next.file && next.file !== previous.file) {
        const previousSrc = get().getNode(id).data.src;
        const src = URL.createObjectURL(next.file);
        get().updateNodeInfo(id, { src });
        next.el.src = src;
        if (previousSrc?.startsWith("blob:")) URL.revokeObjectURL(previousSrc);
      }
      set(({ nodeAudioData }) => {
        return {
          nodeAudioData: new Map(nodeAudioData).set(id, next),
        };
      });
    },
    getAudioData: (id: string) => {
      const data = get().nodeAudioData.get(id);
      if (!data) console.warn(`Could not find audio data of ID ${id}`);
      return data;
    },

    addStarting: (id) => {
      set((state) => ({
        startingNodes: [...state.startingNodes, id],
      }));
    },
    addEnabled: (id) => {
      set((state) => ({
        enabledNodes: [...state.enabledNodes, id],
      }));
    },
    removeStarting: (id) => {
      set((state) => ({
        startingNodes: state.startingNodes.filter((_id) => _id !== id),
      }));
    },
    removeEnabled: (id) => {
      set((state) => ({
        enabledNodes: state.enabledNodes.filter((_id) => _id !== id),
      }));
    },
    clearStarting: () => {
      set(() => ({ startingNodes: [] }));
    },
    clearEnabled: () => {
      set(() => ({ enabledNodes: [] }));
    },

    refreshDuration: () => {
      set({ duration: 0 }); // [TODO] Calculate longest traversal duration...
    },
  };
};
