import { Box, Flex, VStack } from "@chakra-ui/react";
import {
  BiCodeAlt,
  BiFastForward,
  BiPause,
  BiPlay,
  BiPlus,
  BiRewind,
  BiSidebar,
  BiZoomIn,
  BiZoomOut,
} from "react-icons/bi";
import STORE_SELECTORS from "../../store/store";
import { initNode } from "../AudioClipNode/utils";
import { ColorModeButton } from "../ui/color-mode";
import TooltipButton from "./TooltipButton";

export default function Toolbar() {
  const isPlaying = STORE_SELECTORS.isPlaying();
  const togglePlaying = STORE_SELECTORS.togglePlaying();
  const toggleSidebar = STORE_SELECTORS.toggleSidebar();
  const toggleDevtools = STORE_SELECTORS.toggleDevtools();
  const addNodes = STORE_SELECTORS.addNodes();
  const nodeCount = STORE_SELECTORS.nodeCount();

  return (
    <Flex bg="bg.panel" align="center" shadow="md">
      <VStack gap={2} p={2}>
        <TooltipButton label="Toggle Sidebar" onClick={toggleSidebar}>
          <BiSidebar />
        </TooltipButton>
      </VStack>
      {/* Transport Controls */}
      <Flex gap={2}>
        <TooltipButton label="Play/Pause" onClick={() => togglePlaying()}>
          {isPlaying ? <BiPause /> : <BiPlay />}
        </TooltipButton>
        {/* <TooltipButton label="Stop" onClick={() => {}}>
          <BiStop />
        </TooltipButton> */}
        <TooltipButton label="Rewind" onClick={() => {}}>
          <BiRewind />
        </TooltipButton>
        <TooltipButton label="Fast Forward" onClick={() => {}}>
          <BiFastForward />
        </TooltipButton>
        {/* <TooltipButton label="Repeat" onClick={() => {}}>
          <BiRepeat />
        </TooltipButton> */}
      </Flex>

      {/* Node Controls */}
      <Flex gap={2}>
        <TooltipButton
          label="Add Node"
          onClick={() => addNodes([initNode(nodeCount, { x: 50, y: 50 })])}
        >
          <BiPlus />
        </TooltipButton>
        {/* <TooltipButton label="Delete Node" onClick={() => {}}>
          <BiTrash />
        </TooltipButton> */}
      </Flex>

      <Box flex="1" />

      {/* View + File Controls */}
      <Flex gap={2}>
        {import.meta.env.DEV && (
          <TooltipButton label="Toggle Devtools" onClick={toggleDevtools}>
            <BiCodeAlt />
          </TooltipButton>
        )}
        <ColorModeButton />
        <TooltipButton label="Zoom In" onClick={() => {}}>
          <BiZoomIn />
        </TooltipButton>
        <TooltipButton label="Zoom Out" onClick={() => {}}>
          <BiZoomOut />
        </TooltipButton>
        {/* <TooltipButton label="Export" onClick={() => {}}>
          <BiExport />
        </TooltipButton> */}
      </Flex>
    </Flex>
  );
}
