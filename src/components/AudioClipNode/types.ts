import type { Node } from "@xyflow/react";

export type AudioClipInfo = {
  src?: string;
};

export type AudioClipNodeType = Node<AudioClipInfo, "audioTrackNode">;
