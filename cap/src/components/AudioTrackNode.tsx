import { ChangeEvent, memo } from "react";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { Box } from "@chakra-ui/react";

const AudioTrackNode = memo(
  ({
    data,
  }: NodeProps<
    Node<{
      label: string;
      src: string;
      onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    }>
  >) => {
    return (
      <Box
        color="black"
        rounded={4}
        borderWidth={1}
        borderColor={"black"}
        p={4}
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
      </Box>
    );
  },
);

export default AudioTrackNode;
