import type { Node } from "@xyflow/react";

export type AudioClipData = {
  src?: string;
  file?: File;
  srcNode?: MediaElementAudioSourceNode;
};

export type AudioClipNodeType = Node<AudioClipData, "audioTrackNode">;
