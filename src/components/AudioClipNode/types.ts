import type { Node } from "@xyflow/react";

export type ClipData = {
  src?: string;
  el?: HTMLAudioElement;
  duration: number;
  currentTime: number;
};

export type ClipNodeType = Node<ClipData, "audioTrackNode">;
