import { Flex, HStack, Separator } from "@chakra-ui/react";
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

function VerticalSeparator() {
  return <Separator orientation="vertical" h={8} m={2} />;
}

export default function Toolbar() {
  const isPlaying = STORE_SELECTORS.isPlaying();
  const togglePlaying = STORE_SELECTORS.togglePlaying();
  const toggleSidebar = STORE_SELECTORS.toggleSidebar();
  const toggleDevtools = STORE_SELECTORS.toggleDevtools();
  const addNodes = STORE_SELECTORS.addNodes();
  const nodeCount = STORE_SELECTORS.nodeCount();

  return (
    <Flex
      bg="bg.panel"
      align="center"
      justify="space-between"
      shadow="sm"
      zIndex={1}
      gap={2}
      p={2}
    >
      <HStack>
        <TooltipButton label="Toggle Sidebar" onClick={toggleSidebar}>
          <BiSidebar />
        </TooltipButton>
      </HStack>

      <HStack>
        <TooltipButton label="Play/Pause" onClick={() => togglePlaying()}>
          {isPlaying ? <BiPause /> : <BiPlay />}
        </TooltipButton>
        {/* <TooltipButton label="Stop" onClick={() => {}}>
          <BiStop />
        </TooltipButton> */}
        <VerticalSeparator />
        <TooltipButton label="Rewind" onClick={() => {}}>
          <BiRewind />
        </TooltipButton>
        <TooltipButton label="Fast Forward" onClick={() => {}}>
          <BiFastForward />
        </TooltipButton>
        {/* <TooltipButton label="Repeat" onClick={() => {}}>
          <BiRepeat />
        </TooltipButton> */}
      </HStack>

      <HStack>
        <TooltipButton
          label="Add Node"
          onClick={() => addNodes([initNode(nodeCount, { x: 50, y: 50 })])}
        >
          <BiPlus />
        </TooltipButton>
      </HStack>
      {/* <TooltipButton label="Delete Node" onClick={() => {}}>
          <BiTrash />
        </TooltipButton> */}

      <HStack>
        {import.meta.env.DEV && (
          <>
            <TooltipButton label="Toggle Devtools" onClick={toggleDevtools}>
              <BiCodeAlt />
            </TooltipButton>

            <VerticalSeparator />
          </>
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
      </HStack>
    </Flex>
  );
}
