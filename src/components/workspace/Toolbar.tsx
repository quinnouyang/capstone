import { Box, Flex, IconButton, VStack } from "@chakra-ui/react";
import {
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
import { Tooltip } from "../ui/tooltip";

export default function Toolbar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <Flex bg="gray.800" color="white" align="center" shadow="md">
      <VStack align="stretch" gap={2} p={2}>
        <IconButton
          aria-label="Dock sidebar"
          size="sm"
          onClick={() => setOpen(!open)}
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
