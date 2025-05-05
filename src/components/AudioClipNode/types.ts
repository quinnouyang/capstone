import type { Node } from "@xyflow/react";

export type AudioClipData = {
  src?: string;
  el?: HTMLAudioElement;
  duration: number;
  currentTime: number;
};

export type AudioClipNodeType = Node<AudioClipData, "audioTrackNode">;
