import { Box } from "@chakra-ui/react";

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  return (
    <Box
      position="absolute"
      h="full"
      bg="gray.800"
      color="white"
      shadow="md"
      w={isOpen ? 240 : 0}
      transition="width 0.2s ease"
      zIndex={1}
      overflow="hidden"
    >
      {isOpen && <>Hello!</>}
    </Box>
  );
}
