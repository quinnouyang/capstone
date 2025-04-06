import { ChangeEvent, memo, useEffect, useId, useRef } from "react";
import {
  Handle,
  Node,
  NodeProps,
  NodeResizer,
  NodeToolbar,
  Position,
} from "@xyflow/react";
import { Button, Stack } from "@chakra-ui/react";
import { FileInput, FileUploadRoot } from "./ui/file-upload";
import { createAudioNodeSource } from "../engine/core";
import { extendId } from "./utils";

export type AudioTrackNodeData = {
  src?: string;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const AudioTrackNode = memo(
  ({
    data: { src, onInputChange },
    selected,
  }: NodeProps<Node<AudioTrackNodeData>>) => {
    const ref = useRef<HTMLAudioElement>(null);

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
          type="target"
          position={Position.Left}
          isConnectableStart={false}
        />
        <Handle
          type="source"
          position={Position.Right}
          isConnectableEnd={false}
        />
        <NodeToolbar>
          <Button>TEST</Button>
        </NodeToolbar>
        <NodeResizer isVisible={selected} />
        <FileUploadRoot
          id="audioTrack"
          accept="audio/*"
          onChange={onInputChange}
        >
          <FileInput />
        </FileUploadRoot>
        <audio ref={ref} id={extendId(src, useId())} controls src={src}></audio>
      </Stack>
    );
  },
);

export default AudioTrackNode;
