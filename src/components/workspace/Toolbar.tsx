import { Box, Flex, IconButton, VStack } from "@chakra-ui/react";
import {
  BiCodeAlt,
  BiExport,
  BiFastForward,
  BiPlay,
  BiPlus,
  BiRepeat,
  BiRewind,
  BiScatterChart,
  BiSidebar,
  BiStop,
  BiTrash,
  BiZoomIn,
  BiZoomOut,
} from "react-icons/bi";
import useShallowStore from "../../store/store";
import { Tooltip } from "../ui/tooltip";

export default function Toolbar() {
  const { toggleSidebar, toggleDevtools } = useShallowStore((s) => ({
    toggleSidebar: s.toggleSidebar,
    toggleDevtools: s.toggleDevtools,
  }));

  return (
    <Flex bg="gray.800" color="white" align="center" shadow="md">
      <VStack align="stretch" gap={2} p={2}>
        <IconButton
          aria-label="Dock sidebar"
          size="sm"
          onClick={() => toggleSidebar()}
        >
          <BiSidebar />
        </IconButton>
      </VStack>
      {/* Transport Controls */}
      <Flex gap={2}>
        <Tooltip content="Play (Space)">
          <IconButton aria-label="Play">
            <BiPlay />
          </IconButton>
        </Tooltip>
        <Tooltip content="Stop">
          <IconButton aria-label="Stop">
            <BiStop />
          </IconButton>
        </Tooltip>
        <Tooltip content="Rewind">
          <IconButton aria-label="Rewind">
            <BiRewind />
          </IconButton>
        </Tooltip>
        <Tooltip content="Fast Forward">
          <IconButton aria-label="Fast Forward">
            <BiFastForward />
          </IconButton>
        </Tooltip>
        <Tooltip content="Loop">
          <IconButton aria-label="Loop">
            <BiRepeat />
          </IconButton>
        </Tooltip>
      </Flex>

      {/* Node Controls */}
      <Flex gap={2}>
        <Tooltip content="Add Node (A)">
          <IconButton aria-label="Add Node">
            <BiPlus />
          </IconButton>
        </Tooltip>
        <Tooltip content="Delete Selected (Del)">
          <IconButton aria-label="Delete Selected">
            <BiTrash />
          </IconButton>
        </Tooltip>
        <Tooltip content="Auto Layout">
          <IconButton aria-label="Auto Layout">
            <BiScatterChart />
          </IconButton>
        </Tooltip>
      </Flex>

      <Box flex="1" />

      {/* View + File Controls */}
      <Flex gap={2}>
        {import.meta.env.DEV && (
          <Tooltip content="Developer Tools">
            <IconButton aria-label="Dev Tools" onClick={() => toggleDevtools()}>
              <BiCodeAlt />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip content="Zoom Out">
          <IconButton aria-label="Zoom Out">
            <BiZoomOut />
          </IconButton>
        </Tooltip>
        <Tooltip content="Zoom In">
          <IconButton aria-label="Zoom In">
            <BiZoomIn />
          </IconButton>
        </Tooltip>
        <Tooltip content="Export Audio">
          <IconButton aria-label="Export">
            <BiExport />
          </IconButton>
        </Tooltip>
      </Flex>
    </Flex>
  );
}
