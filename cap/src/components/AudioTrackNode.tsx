import { Button, Stack } from "@chakra-ui/react";
import {
  Handle,
  Node,
  NodeProps,
  NodeResizer,
  NodeToolbar,
  Position,
  useNodeConnections,
  type XYPosition,
} from "@xyflow/react";
import { ChangeEvent, useEffect, useRef } from "react";
import { useShallow } from "zustand/shallow";

import { createAudioNodeSource } from "../engine/core";
import useCustomStore from "../store";
import { FileInput, FileUploadRoot } from "./ui/file-upload";
import { genId } from "./utils";

export type AudioTrackNode = Node<
  {
    src?: string;
  },
  "audioTrackNode"
>;

export function initNode(
  idx: number,
  position: XYPosition,
  data: AudioTrackNode["data"],
): AudioTrackNode {
  return {
    id: genId(idx, "node"),
    position,
    data,
    type: "audioTrackNode",
    origin: [0, 0.5],
  };
}

export function AudioTrackNode({
  id,
  data: { src },
  selected,
}: NodeProps<AudioTrackNode>) {
  const ref = useRef<HTMLAudioElement>(null);
  const { getNode, updateNodeData } = useCustomStore(
    useShallow((s) => ({
      getNode: s.getNode,
      updateNodeData: s.updateNodeData,
    })),
  );
  const outConnections = useNodeConnections({ handleType: "source" });

  function onChange({ target: { files } }: ChangeEvent<HTMLInputElement>) {
    if (!files || !files[0]) {
      console.warn("No file selected");
      return;
    }

    // https://reactflow.dev/examples/nodes/update-node, https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications#using_object_urls
    updateNodeData(id, { src: URL.createObjectURL(files[0]) });
  }

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      console.warn("AudioTrackNode: ref is null");
      return;
    }

    createAudioNodeSource(el);

    el.addEventListener("ended", () => {
      outConnections.forEach(({ target }) => {
        console.log(getNode(target));
      });
    });
  }, [ref]);

  return (
    <Stack
      color="black"
      bgColor="white"
      rounded={16}
      borderWidth={2}
      borderColor={"black"}
      p={4}
      gap={4}
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
      <audio
        ref={ref}
        id={id}
        controls
        src={src}
        onPlay={() => console.log("Playing", ref.current?.currentTime)}
        onPause={() => console.log("Paused", ref.current?.currentTime)}
        onEnded={() => console.log("Ended", ref.current?.currentTime)}
      ></audio>
    </Stack>
  );
}
