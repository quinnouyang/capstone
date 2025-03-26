import { ChangeEvent, memo } from "react";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { Stack } from "@chakra-ui/react";

export type AudioTrackNodeData = {
  src?: string;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const AudioTrackNode = memo(
  ({ data: { src, onInputChange } }: NodeProps<Node<AudioTrackNodeData>>) => {
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
        <Handle type="target" position={Position.Left} />
        <input
          type="file"
          id="audioTrack"
          accept="audio/*"
          onChange={onInputChange}
        />
        <audio controls src={src}></audio>
        <Handle type="source" position={Position.Right} />
      </Stack>
    );
  },
);

export default AudioTrackNode;
