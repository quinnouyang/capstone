import { addEdge, type Edge } from "@xyflow/react";
import AudioTrackNodeComponent, {
  initNode,
  type AudioTrackNode,
} from "./AudioTrackNode";

export const INIT_NODES: AudioTrackNode[] = [
  initNode(0, { x: 0, y: 0 }),
  initNode(1, { x: 800, y: 200 }),
];

export const INIT_EDGES: Edge[] = addEdge(
  {
    source: INIT_NODES[0].id,
    target: INIT_NODES[1].id,
    sourceHandle: "out",
    targetHandle: "in",
  },
  [],
);

export const NODE_TYPES = {
  audioTrackNode: AudioTrackNodeComponent,
};
