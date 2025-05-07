import { Box } from "@chakra-ui/react";
import { Handle, Position } from "@xyflow/react";

export default function ClipNodeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box borderWidth={2} rounded="md" bg="bg.emphasized" color="fg">
      <Handle
        id="in"
        type="target"
        style={{ width: 12, height: 12 }}
        position={Position.Left}
        isConnectableStart={false}
      />
      <Handle
        id="out"
        type="source"
        style={{ width: 12, height: 12 }}
        position={Position.Right}
        isConnectableEnd={false}
      />
      {children}
    </Box>
  );
}
