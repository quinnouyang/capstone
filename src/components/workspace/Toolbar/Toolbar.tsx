import { Flex, HStack, Separator } from "@chakra-ui/react";
import { useReactFlow } from "@xyflow/react";
import {
  BiCodeAlt,
  BiFastForward,
  BiFullscreen,
  BiRewind,
  BiSidebar,
  BiZoomIn,
  BiZoomOut,
} from "react-icons/bi";
import STORE_SELECTORS from "../../../store/store";
import { ColorModeButton } from "../../ui/color-mode";
import TooltipButton from "../TooltipButton";
import AddAudioClipButton from "./AddAudioClipButton";
import PlaybackTime from "./PlaybackTime";
import PlayPauseButton from "./PlayPauseButton";

function VerticalSeparator() {
  return <Separator orientation="vertical" h={8} m={2} />;
}

export default function Toolbar() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const toggleSidebar = STORE_SELECTORS.toggleSidebar();
  const toggleDevtools = STORE_SELECTORS.toggleDevtools();

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

        <VerticalSeparator />

        <PlayPauseButton />
        {/* <TooltipButton label="Stop" onClick={() => {}}>
          <BiStop />
        </TooltipButton> */}
        <TooltipButton label="Go to Start" onClick={() => {}}>
          <BiRewind />
        </TooltipButton>
        <TooltipButton label="Go to End" onClick={() => {}}>
          <BiFastForward />
        </TooltipButton>
        {/* <TooltipButton label="Repeat" onClick={() => {}}>
          <BiRepeat />
        </TooltipButton> */}

        <VerticalSeparator />

        <PlaybackTime />
      </HStack>

      <HStack position="absolute" left="50%" transform="translateX(-50%)">
        <AddAudioClipButton />
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
        <TooltipButton label="Zoom In" onClick={() => zoomIn()}>
          <BiZoomIn />
        </TooltipButton>
        <TooltipButton label="Zoom Out" onClick={() => zoomOut()}>
          <BiZoomOut />
        </TooltipButton>
        <TooltipButton label="Reset view" onClick={() => fitView()}>
          <BiFullscreen />
        </TooltipButton>
        {/* <TooltipButton label="Toggle editing" onClick={() => {}}>
          <BiLock />
        </TooltipButton> */}
        {/* <TooltipButton label="Export" onClick={() => {}}>
          <BiExport />
        </TooltipButton> */}
      </HStack>
    </Flex>
  );
}
