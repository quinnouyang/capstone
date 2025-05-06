import { IconButton } from "@chakra-ui/react";
import { LuPause, LuPlay } from "react-icons/lu";
import type { State } from "../store/store";
import useShallowStore from "../store/store";

const SELECTOR = (s: State) => ({
  isPlaying: s.isPlaying,
  togglePlayPause: s.togglePlay,
});

export default function PlayPause() {
  const { isPlaying, togglePlayPause } = useShallowStore(SELECTOR);

  return (
    <IconButton aria-label="switch" onClick={togglePlayPause}>
      {isPlaying ? <LuPause /> : <LuPlay />}
    </IconButton>
  );
}
