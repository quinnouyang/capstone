import { ChangeEvent, memo } from "react";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { Stack } from "@chakra-ui/react";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type AudioTrackNodeData = {
  label: string;
  src?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

const AudioTrackNode = memo(({ data }: NodeProps<Node<AudioTrackNodeData>>) => {
  return (
    <Stack
      color="black"
      bgColor="white"
      rounded={4}
      borderWidth={1}
      borderColor={"black"}
      p={4}
      gap={2}
    >
      <Handle type="target" position={Position.Left} />
      <input
        type="file"
        id="audioTrack"
        accept="audio/*"
        onChange={data.onChange}
      />
      <audio controls src={data.src}></audio>
      <Handle type="source" position={Position.Right} id="a" />
      <Handle type="source" position={Position.Right} id="b" />
    </Stack>
  );
});

export default AudioTrackNode;
