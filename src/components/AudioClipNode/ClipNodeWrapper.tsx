import { Stack } from "@chakra-ui/react";
import { Handle, Position } from "@xyflow/react";

export default function ClipNodeWrapper<T = unknown>(
  props: { children: React.ReactNode } & T,
) {
  const { children, ...rest } = props;

  return (
    <Stack
      color="black"
      bgColor="white"
      rounded={16}
      borderWidth={2}
      borderColor={"black"}
      p={4}
      gap={4}
      {...rest}
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
      {children}
    </Stack>
  );
}
