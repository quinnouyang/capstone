import { addEdge, type Edge } from "@xyflow/react";
import {
  type AudioTrackNode,
  AudioTrackNode as AudioTrackNodeComponent,
  initNode,
} from "./AudioTrackNode";

import src0 from "../../audio/apple/Antic-EncoreInfinitum.wav";
import src1 from "../../audio/apple/Droplet-EncoreInfinitum.wav";
import src2 from "../../audio/apple/Rebound-EncoreInfinitum.wav";

export const INIT_NODES: AudioTrackNode[] = [
  initNode(0, { x: 0, y: 0 }, { src: src0 }),
  initNode(1, { x: 800, y: 200 }, { src: src2 }),
  initNode(2, { x: 800, y: -200 }, { src: src1 }),
];

export const INIT_EDGES: Edge[] = addEdge(
  {
    source: INIT_NODES[0].id,
    target: INIT_NODES[1].id,
    sourceHandle: "out",
    targetHandle: "in",
  },
  addEdge(
    {
      source: INIT_NODES[0].id,
      target: INIT_NODES[2].id,
      sourceHandle: "out",
      targetHandle: "in",
    },
    addEdge(
      {
        source: INIT_NODES[1].id,
        target: INIT_NODES[0].id,
        sourceHandle: "out",
        targetHandle: "in",
      },
      addEdge(
        {
          source: INIT_NODES[2].id,
          target: INIT_NODES[0].id,
          sourceHandle: "out",
          targetHandle: "in",
        },
        addEdge(
          {
            source: INIT_NODES[1].id,
            target: INIT_NODES[2].id,
            sourceHandle: "out",
            targetHandle: "in",
          },
          [],
        ),
      ),
    ),
  ),
);

export const NODE_TYPES = {
  audioTrackNode: AudioTrackNodeComponent,
};
