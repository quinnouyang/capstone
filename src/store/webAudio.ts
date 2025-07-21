import { StateCreator } from "zustand";
import type { ReactFlowSlice } from "./reactFlow";

// type AudioClipData = {
//   file: File;
//   el: HTMLAudioElement;
//   srcNode: MediaElementAudioSourceNode;
// };

type State = {
  ctx: AudioContext;
  isPlaying: boolean;

  // _nodeAudioData: Map<string, AudioClipData>;
  // _initElsBecauseOfSomeBullshitBug: Set<HTMLAudioElement>;

  startingNodes: string[];
  enabledNodes: string[];
  duration: number;
};

type Functions = {
  setIsPlaying: (isPlaying: boolean) => void;
  togglePlaying: () => void;
  playNodeEl: (id: string) => void;

  // initData: (id: string, el: HTMLAudioElement) => Promise<AudioClipData>;
  // updateData: (id: string, data: AudioClipData) => AudioClipData;
  // getData: (id: string) => AudioClipData;

  addStarting: (id: string) => void;
  addEnabled: (id: string) => void;
  removeStarting: (id: string) => void;
  removeEnabled: (id: string) => void;
  clearStarting: () => void;
  clearEnabled: () => void;

  refreshDuration: (time: number) => void;
};

export type WebAudioSlice = State & Functions;

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

    // _nodeAudioData: new Map<string, AudioClipData>(),
    // _initElsBecauseOfSomeBullshitBug: new Set<HTMLAudioElement>(),

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
      const el = get()._nodeAudioData.get(id)?.el;
      if (!el) return console.warn("Could not find audio source", id);
      el.play();
    },

    // initData: async (id: string, el: HTMLAudioElement) => {
    //   // [BUG] We get some weird race condition where this gets called again on the same `el` before `await` blocking the `updateAudioData` resolves so we do a dumb check here to prevent that dumass from giving me an error and preventing me from graduatings dlkhfghalf
    //   if (get()._initElsBecauseOfSomeBullshitBug.has(el))
    //     return console.warn("Audio data already init", id);

    //   set(({ _initElsBecauseOfSomeBullshitBug }) => ({
    //     _initElsBecauseOfSomeBullshitBug: new Set(
    //       _initElsBecauseOfSomeBullshitBug,
    //     ).add(el),
    //   }));

    //   const srcNode = get().ctx.createMediaElementSource(el);
    //   srcNode.connect(get().ctx.destination);

    //   return get().updateData(id, {
    //     file: new File([await (await fetch(el.src)).blob()], "init " + el.src),
    //     el,
    //     srcNode,
    //   });
    // },
    // updateData: (id: string, data: AudioClipData) => {
    //   console.log("UPDATING");
    //   console.log(get()._nodeAudioData);

    //   set(({ _nodeAudioData: nodeAudioData }) => ({
    //     _nodeAudioData: new Map(nodeAudioData).set(id, {
    //       ...nodeAudioData.get(id),
    //       ...data,
    //     }),
    //   }));

    //   console.log(get()._nodeAudioData);

    //   return get().getData(id);
    // },
    // getData: (id: string) => {
    //   const data = get()._nodeAudioData.get(id);
    //   if (!data) {
    //     console.warn(
    //       `Could not find audio data of ID ${id}`,
    //       get()._nodeAudioData,
    //     );
    //     console.trace();
    //   }

    //   return data;
    // },

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
