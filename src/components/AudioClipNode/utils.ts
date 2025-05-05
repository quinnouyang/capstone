import type { XYPosition } from "@xyflow/react";
import { genId } from "../utils";
import type { AudioClipData, AudioClipNodeType } from "./types";

export function initNode(
  idx: number,
  position: XYPosition,
  data: AudioClipData = { duration: 0, currentTime: 0 },
): AudioClipNodeType {
  return {
    id: genId(idx, "node"),
    position,
    data,
    type: "audioTrackNode",
    origin: [0, 0.5],
  };
}
