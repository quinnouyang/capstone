import { addEdge, type Edge } from "@xyflow/react";

import src0 from "../../assets/1.wav";
import src1 from "../../assets/2.wav";
import src2 from "../../assets/3.wav";
import AudioClipNode from "./AudioClipNode/AudioClipNode";
import type { AudioClipNodeType } from "./AudioClipNode/types";
import { initNode } from "./AudioClipNode/utils";

export const INIT_NODES: AudioClipNodeType[] = [
  initNode(0, { x: 0, y: 0 }, { src: src0, duration: -3, currentTime: -2 }),
  initNode(1, { x: 800, y: 200 }, { src: src2, duration: -3, currentTime: -2 }),
  initNode(
    2,
    { x: 800, y: -200 },
    { src: src1, duration: -3, currentTime: -2 },
  ),
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
  audioTrackNode: AudioClipNode,
};
