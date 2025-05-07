import { Heading } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import STORE_SELECTORS from "../../../store/store";
import { Tooltip } from "../../ui/tooltip";

const TIME_BUFF = ["", "", "", "", "", "", "", "", "", ""]; // HH:MM:SS.mm (max. 99:59:59.99)

function fmtTimestamp(secs: number): string {
  const h = (secs / 3600) | 0;
  const m = ((secs / 60) | 0) % 60;
  const s = (secs | 0) % 60;
  const f = ((secs % 1) * 100) | 0;

  let i = 0;
  if (h > 0) {
    TIME_BUFF[i++] = h.toString();
    TIME_BUFF[i++] = ":";
    TIME_BUFF[i++] = m.toString().padStart(2, "0");
  } else if (m >= 0) {
    TIME_BUFF[i++] = m.toString();
  }
  if (i > 0) TIME_BUFF[i++] = ":";
  TIME_BUFF[i++] = s.toString().padStart(i > 0 ? 2 : 1, "0");
  TIME_BUFF[i++] = ".";
  TIME_BUFF[i++] = f.toString().padStart(2, "0");

  return TIME_BUFF.slice(0, i).join("");
}

function useCurrSecs() {
  const rafRef = useRef<number | null>(null);
  const ctx = STORE_SELECTORS.ctx();
  const [time, setTime] = useState(ctx.currentTime);

  useEffect(() => {
    const tick = () => {
      setTime(ctx.currentTime);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current!);
  }, [ctx]);

  return time;
}

export default function PlaybackTime() {
  const currTime = useCurrSecs();
  const totalTime = STORE_SELECTORS.duration();

  return (
    <Tooltip content="Playback time (MM:SS.mm)" openDelay={100}>
      <Heading minW="24ch">
        {fmtTimestamp(currTime)} / {fmtTimestamp(totalTime)}
      </Heading>
    </Tooltip>
  );
}
