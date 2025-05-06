import type { XYPosition } from "@xyflow/react";
import { genId } from "../utils";
import type { AudioClipNodeType } from "./types";

export function initNode(
  idx: number,
  position: XYPosition,
  src?: string,
): AudioClipNodeType {
  return {
    id: genId(idx, "node"),
    position,
    data: { src },
    type: "audioTrackNode",
    origin: [0, 0.5],
  };
}
