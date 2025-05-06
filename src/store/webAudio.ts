import { StateCreator } from "zustand";
import type { ReactFlowSlice } from "./reactFlow";

export type WebAudioSlice = {
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
      srcNode.play();
    },
    setCurrTime: (time) => {
      set({ currTime: time });
    },
    setTotalTime: (time) => {
      set({ totalTime: time });
    },
  };
};
