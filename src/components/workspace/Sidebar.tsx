import { Box } from "@chakra-ui/react";
import useShallowStore from "../../store/store";

export default function Sidebar() {
  const { sidebarOpen } = useShallowStore((s) => ({
    sidebarOpen: s.sidebarOpen,
  }));

  return (
    <Box
      position="absolute"
      h="full"
      bg="gray.800"
      color="white"
      shadow="md"
      w={sidebarOpen ? 240 : 0}
      transition="width 0.2s ease"
      zIndex={1}
      overflow="hidden"
    >
      {sidebarOpen && <>Hello!</>}
    </Box>
  );
}
