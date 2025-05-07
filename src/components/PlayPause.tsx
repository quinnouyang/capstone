import { IconButton } from "@chakra-ui/react";
import { BiPause, BiPlay } from "react-icons/bi";
import STORE_SELECTORS from "../store/store";

export default function PlayPause() {
  const isPlaying = STORE_SELECTORS.isPlaying();
  const togglePlayPause = STORE_SELECTORS.togglePlaying();

  return (
    <IconButton aria-label="switch" onClick={togglePlayPause}>
      {isPlaying ? <BiPlay /> : <BiPause />}
    </IconButton>
  );
}
