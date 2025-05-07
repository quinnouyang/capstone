import {
  Box,
  EmptyStateContent,
  EmptyStateDescription,
  EmptyStateIndicator,
  EmptyStateRoot,
  EmptyStateTitle,
  VStack,
} from "@chakra-ui/react";
import { useNodeId } from "@xyflow/react";
import {
  default as Peaks,
  type PeaksInstance,
  type PeaksOptions,
} from "peaks.js";
import { useEffect, useRef, useState } from "react";
import { BiFileBlank } from "react-icons/bi";
import STORE_SELECTORS from "../../store/store";

type EventEmitter = Parameters<NonNullable<PeaksOptions["player"]>["init"]>[0];

export default function Waveform() {
  const id = useNodeId();
  const zoomRef = useRef<HTMLElement>(undefined);
  const overviewRef = useRef<HTMLElement>(undefined);
  const el = STORE_SELECTORS.nodeAudioData().get(id || "")?.el; // [FIX] Make a reactive getter
  const play = STORE_SELECTORS.playNodeEl();
  const [_, setPeaks] = useState<PeaksInstance | null>(null);
  const ctx = STORE_SELECTORS.ctx();
  const isPlaying = STORE_SELECTORS.isPlaying();
  const [eventEmitter, setEventEmitter] = useState<EventEmitter | null>(null);
  const [isSeeking, setIsSeeking] = useState(false);

  useEffect(() => {
    if (!zoomRef || !overviewRef || !el)
      return console.warn(
        "At least this is null:",
        zoomRef ? (overviewRef ? el || "el" : "overviewRef") : "zoomRef",
      );

    const options: PeaksOptions = {
      zoomview: {
        container: zoomRef.current,
        waveformColor: "#58C4DD",
        showPlayheadTime: true,
        // enablePoints: false,
        // enableSegments: false,
      },
      overview: {
        container: overviewRef.current,
        highlightColor: "#FFFF00",
        // enablePoints: false,
        // enableSegments: false,
      },
      mediaElement: el,
      webAudio: {
        audioContext: ctx,
        multiChannel: true,
      },
      player: {
        init: (_eventEmitter) => {
          setEventEmitter(_eventEmitter);
          return Promise.resolve();
        },
        destroy: () => {},
        play: () => {
          if (!id || !eventEmitter)
            return Promise.reject("No id or eventEmitter");
          play(id);
          return new Promise((resolve) => {
            eventEmitter?.emit("player.playing", el.currentTime);
            resolve();
          });
        },
        pause: () => {
          if (!id || !eventEmitter)
            return Promise.reject("No id or eventEmitter");
          return new Promise(() => {
            eventEmitter.emit("player.pause", el.currentTime);
          });
        },
        isPlaying: () => isPlaying,
        isSeeking: () => isSeeking,
        getCurrentTime: () => el.currentTime,
        getDuration: () => el.duration,
        seek: (time: number) => {
          setIsSeeking(true);
          return new Promise(() => {
            el.currentTime = time;
            eventEmitter?.emit("player.seeked", el.currentTime);
            eventEmitter?.emit("player.timeupdate", el.currentTime);
          });
        },
      },
    };

    (async () => {
      setPeaks(
        await new Promise<PeaksInstance>(async (resolve, reject) => {
          Peaks.init(options, (err, peaks) => {
            if (err) reject(err);
            if (!peaks) throw Error("Peaks is undefined");
            resolve(peaks);
          });
        }),
      );
    })();
  }, [id, ctx, zoomRef, overviewRef, el]);

  return el?.src ? (
    <>
      <Box ref={zoomRef} width="100%" height="320px"></Box>
      <Box ref={overviewRef} width="100%" height="80px"></Box>
    </>
  ) : (
    <>
      <EmptyStateRoot>
        <EmptyStateContent>
          <EmptyStateIndicator>
            <BiFileBlank />
          </EmptyStateIndicator>
          <VStack textAlign="center">
            <EmptyStateTitle>Empty audio clip</EmptyStateTitle>
            <EmptyStateDescription>Upload an audio file</EmptyStateDescription>
          </VStack>
        </EmptyStateContent>
      </EmptyStateRoot>
    </>
  );
}
