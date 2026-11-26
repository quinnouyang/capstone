import { expect, it } from "vitest";
import { initNode } from "../src/components/AudioClipNode/utils";

it("creates a positioned audio clip with its source", () => {
  const node = initNode(42, { x: 10, y: 20 }, "/clip.wav");
  expect(node).toMatchObject({
    id: "node 42",
    position: { x: 10, y: 20 },
    data: { src: "/clip.wav" },
    type: "audioTrackNode",
    dragHandle: ".drag-handle",
  });
});
