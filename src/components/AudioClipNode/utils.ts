import type { XYPosition } from "@xyflow/react";
import { genId } from "../utils";
import type { ClipData, ClipNodeType } from "./types";

export function initNode(
  idx: number,
  position: XYPosition,
  data: ClipData = { duration: 0, currentTime: 0 },
): ClipNodeType {
  return {
    id: genId(idx, "node"),
    position,
    data,
    type: "audioTrackNode",
    origin: [0, 0.5],
  };
}
