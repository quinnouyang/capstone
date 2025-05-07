import type { XYPosition } from "@xyflow/react";
import { genId } from "../utils";

import type { Node } from "@xyflow/react";

export type AudioClipInfo = {
  // name: string;
  src?: string;
};

export type AudioClipNodeType = Node<AudioClipInfo, "audioTrackNode">;

export function initNode(
  idx: number,
  position: XYPosition,
  // name?: string,
  src?: string,
): AudioClipNodeType {
  return {
    id: genId(idx, "node"),
    position,
    data: {
      // name: name || src || `Audio Clip ${idx}`,
      src,
    },
    type: "audioTrackNode",
    dragHandle: ".drag-handle",
    origin: [0, 0.5],
  };
}
