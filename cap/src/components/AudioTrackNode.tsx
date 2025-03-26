import { ChangeEvent, memo } from "react";
import {
  Handle,
  Node,
  NodeProps,
  NodeResizer,
  NodeToolbar,
  Position,
} from "@xyflow/react";
import { Button, Stack } from "@chakra-ui/react";

export type AudioTrackNodeData = {
  src?: string;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const AudioTrackNode = memo(
  ({
    data: { src, onInputChange },
    selected,
  }: NodeProps<Node<AudioTrackNodeData>>) => {
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
        <input
          type="file"
          id="audioTrack"
          accept="audio/*"
          onChange={onInputChange}
        />
        <audio controls src={src}></audio>
      </Stack>
    );
  },
);

export default AudioTrackNode;
