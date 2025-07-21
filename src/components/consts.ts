import { MarkerType, type Edge } from "@xyflow/react";

import src0 from "../../assets/1.wav";
import AudioClipNode from "./AudioClipNode/AudioClipNode";
import { initNode, type AudioClipNodeType } from "./AudioClipNode/utils";

export const INIT_NODES: AudioClipNodeType[] = [
  initNode(0, { x: 0, y: 0 }, src0),
  // initNode(1, { x: 800, y: 200 }, src2),
  // initNode(2, { x: 800, y: -200 }, src1),
];

export function initEdge(source: string, target: string): Edge {
  return {
    id: `${source}-${target}`,
    source,
    target,
    sourceHandle: "out",
    targetHandle: "in",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 36,
      height: 36,
    },
  };
}

export const INIT_EDGES: Edge[] = [
  // initEdge(INIT_NODES[0].id, INIT_NODES[1].id),
  // initEdge(INIT_NODES[0].id, INIT_NODES[2].id),
  // initEdge(INIT_NODES[1].id, INIT_NODES[0].id),
  // initEdge(INIT_NODES[2].id, INIT_NODES[0].id),
  // initEdge(INIT_NODES[1].id, INIT_NODES[2].id),
];

export const NODE_TYPES = {
  audioTrackNode: AudioClipNode,
};
