import { BiPause, BiPlay } from "react-icons/bi";
import STORE_SELECTORS from "../../store/store";
import TooltipButton from "./TooltipButton";

export default function PlayPauseButton() {
  const isPlaying = STORE_SELECTORS.isPlaying();
  const togglePlaying = STORE_SELECTORS.togglePlaying();

  return (
    <TooltipButton label="Toggle playback" onClick={() => togglePlaying()}>
      {isPlaying ? <BiPause /> : <BiPlay />}
    </TooltipButton>
  );
}
