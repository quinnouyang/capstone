import { Button, Stack } from "@chakra-ui/react";
import {
  Handle,
  Node,
  NodeProps,
  NodeResizer,
  NodeToolbar,
  Position,
  type XYPosition,
} from "@xyflow/react";
import { ChangeEvent, useEffect, useRef } from "react";

import type { State } from "../store";
import useShallowStore from "../store";
import { FileInput, FileUploadRoot } from "./ui/file-upload";
import { Slider } from "./ui/slider";
import { formatTimestamp, genId } from "./utils";

type AudioTrackNodeData = {
  src?: string;
  el?: HTMLAudioElement;
  duration: number;
  currentTime: number;
};

export type AudioTrackNode = Node<AudioTrackNodeData, "audioTrackNode">;

export function initNode(
  idx: number,
  position: XYPosition,
  data: AudioTrackNodeData = { duration: 0, currentTime: 0 },
): AudioTrackNode {
  return {
    id: genId(idx, "node"),
    position,
    data,
    type: "audioTrackNode",
    origin: [0, 0.5],
  };
}

const SELECTOR = (s: State) => ({
  updateNodeData: s.updateNodeData,
  getOutputNodes: s.getOutputNodes,
  createAudioNodeSource: s.createAudioNodeSource,
  play: s.play,
});

export function AudioTrackNode({
  id,
  data,
  selected,
}: NodeProps<AudioTrackNode>) {
  const ref = useRef<HTMLAudioElement>(null);
  const { updateNodeData, getOutputNodes, createAudioNodeSource, play } =
    useShallowStore(SELECTOR);

  function onChange({ target: { files } }: ChangeEvent<HTMLInputElement>) {
    if (!ref.current) return console.warn("AudioTrackNode: ref is null");
    if (!files || !files[0]) return console.warn("No file selected");

    // https://reactflow.dev/examples/nodes/update-node, https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications#using_object_urls
    updateNodeData(id, {
      ...data,
      src: URL.createObjectURL(files[0]),
      el: ref.current,
      duration: ref.current.duration,
      currentTime: ref.current.currentTime,
    });
  }

  useEffect(() => {
    const el = ref.current;
    if (!el) return console.warn("AudioTrackNode: ref is null");

    createAudioNodeSource(el);
    updateNodeData(id, {
      ...data,
      el,
      duration: el.duration,
      currentTime: el.currentTime,
    });
  }, [ref]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return console.warn("AudioTrackNode: ref is null");

    el.addEventListener("ended", () => {
      getOutputNodes(id).forEach(({ id }) => {
        play(id);
      });
    });
  }, [ref, getOutputNodes]);

  return (
    <Stack
      color="black"
      bgColor="white"
      rounded={16}
      borderWidth={2}
      borderColor={"black"}
      p={4}
      gap={4}
      minW={data.duration || 0 * 100}
    >
      <Handle
        id="in"
        type="target"
        position={Position.Left}
        isConnectableStart={false}
      />
      <Handle
        id="out"
        type="source"
        position={Position.Right}
        isConnectableEnd={false}
      />
      <NodeToolbar>
        <Button>TEST</Button>
      </NodeToolbar>
      <NodeResizer isVisible={selected} />
      <FileUploadRoot accept="audio/*" onChange={onChange}>
        <FileInput />
      </FileUploadRoot>
      <audio ref={ref} id={id} controls src={data.src}></audio>
      <Slider
        marks={[
          { value: 0, label: "0:00" },
          {
            value: data.duration || 100,
            label: formatTimestamp(data.duration || -1),
          },
        ]}
        value={[(() => data.currentTime)() || 0]}
        max={data.duration || 100}
      />
    </Stack>
  );
}
