import { StateCreator } from "zustand";
import type { ReactFlowSlice } from "./reactFlow";

type AudioClipData = {
  file: File;
  el: HTMLAudioElement;
  srcNode: MediaElementAudioSourceNode;
};

type State = {
  ctx: AudioContext;
  isPlaying: boolean;
  nodeAudioData: Map<string, AudioClipData>;
  duration: number;
};

type Functions = {
  setIsPlaying: (isPlaying: boolean) => void;
  togglePlaying: () => void;
  initAudioData: (id: string, el: HTMLAudioElement) => void;
  updateAudioData: (id: string, data: Partial<AudioClipData>) => void;
  playNodeEl: (id: string) => void;
  setDuration: (time: number) => void;
};

export type WebAudioSlice = State & Functions;

export const createWebAudioSlice: StateCreator<
  ReactFlowSlice & WebAudioSlice,
  [],
  [],
  WebAudioSlice
> = (set, get) => {
  const ctx = new AudioContext();
  ctx.suspend();

  return {
    ctx,
    isPlaying: false,
    nodeAudioData: new Map<string, AudioClipData>(),
    currTime: 0,
    duration: 0,

    setIsPlaying: (isPlaying) => {
      set({ isPlaying });
      if (isPlaying) ctx.resume();
      else ctx.suspend();
    },
    togglePlaying: () => {
      get().setIsPlaying(!get().isPlaying);
      if (!get().isPlaying) return;
      const firstId = get().nodes.at(0)?.id;
      if (firstId) get().playNodeEl(firstId);
    },

    initAudioData: (id: string, el: HTMLAudioElement) => {
      if (get().nodeAudioData.has(id)) {
        console.warn("Audio data already exists", id);
        return get().nodeAudioData.get(id)!;
      }

      const srcNode = get().ctx.createMediaElementSource(el);
      srcNode.connect(get().ctx.destination);

      set(({ nodeAudioData }) => ({
        nodeAudioData: new Map(nodeAudioData).set(id, {
          file: new File([], el.src),
          el,
          srcNode,
        }),
      }));

      return srcNode;
    },
    updateAudioData: (id: string, data: Partial<AudioClipData>) => {
      set(({ nodeAudioData }) => ({
        nodeAudioData: new Map(nodeAudioData).set(id, {
          ...nodeAudioData.get(id)!,
          ...data,
        }),
      }));
    },

    playNodeEl: (id) => {
      const el = get().nodeAudioData.get(id)?.el;
      if (!el) return console.warn("Could not find audio source", id);
      el.play();
    },
    setDuration: (time) => {
      set({ duration: time });
    },
  };
};
