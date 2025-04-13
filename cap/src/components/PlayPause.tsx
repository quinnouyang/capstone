import { IconButton } from "@chakra-ui/react";
import { LuPause, LuPlay } from "react-icons/lu";
import { useShallow } from "zustand/shallow";
import useCustomStore from "../store";

export default function PlayPause() {
  const { isPlaying, togglePlayPause } = useCustomStore(
    useShallow((s) => ({
      isPlaying: s.isPlaying,
      togglePlayPause: s.togglePlay,
    })),
  );
  return (
    <IconButton aria-label="switch" onClick={togglePlayPause}>
      {isPlaying ? <LuPause /> : <LuPlay />}
    </IconButton>
  );
}
