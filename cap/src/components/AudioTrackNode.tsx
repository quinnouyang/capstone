import { Button, Stack } from "@chakra-ui/react";
import {
  Handle,
  Node,
  NodeProps,
  NodeResizer,
  NodeToolbar,
  Position,
  useReactFlow,
  type XYPosition,
} from "@xyflow/react";
import { ChangeEvent, memo, useEffect, useRef } from "react";
import { createAudioNodeSource } from "../engine/core";
import { FileInput, FileUploadRoot } from "./ui/file-upload";
import { genId } from "./utils";

export type AudioTrackNode = Node<{
  src?: string;
}>;

export function initNode(idx: number, position: XYPosition): AudioTrackNode {
  return {
    id: genId(idx, "node"),
    position,
    data: {},
    type: "audioTrackNode",
    origin: [0, 0.5],
  };
}

// [TODO] Debug onChange with wrong id of 0
const AudioTrackNodeComponent = memo(
  ({ id, data: { src }, selected }: NodeProps<AudioTrackNode>) => {
    const ref = useRef<HTMLAudioElement>(null);
    const { updateNodeData } = useReactFlow<AudioTrackNode>();

    function onChange({ target: { files } }: ChangeEvent<HTMLInputElement>) {
      if (!files || !files[0]) {
        console.warn("No file selected");
        return;
      }

      // Update `src` in state of corresponding node
      // See https://reactflow.dev/examples/nodes/update-node
      // and https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications#using_object_urls
      updateNodeData(id, { src: URL.createObjectURL(files[0]) });
    }

    useEffect(() => {
      if (!ref.current) {
        console.warn("AudioTrackNode: ref is null");
        return;
      }

      createAudioNodeSource(ref.current);
    }, []);

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
        <FileUploadRoot id="audioTrack" accept="audio/*" onChange={onChange}>
          <FileInput />
        </FileUploadRoot>
        <audio ref={ref} id={id} controls src={src}></audio>
      </Stack>
    );
  },
);

export default AudioTrackNodeComponent;
