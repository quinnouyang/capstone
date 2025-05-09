import { NodeProps, NodeToolbar } from "@xyflow/react";
import { ChangeEvent, useEffect, useRef } from "react";

import { Box, chakra, Flex, Heading } from "@chakra-ui/react";
import STORE_SELECTORS from "../../store/store";
import { FileInput, FileUploadRoot } from "../ui/file-upload";
import ClipNodeWrapper from "./ClipNodeWrapper";
import Waveform from "./Waveform";
import type { AudioClipNodeType } from "./utils";

export default function AudioClipNode({
  id,
  data: { src },
}: NodeProps<AudioClipNodeType>) {
  const ref = useRef<HTMLAudioElement>(null);

  const updateAudioData = STORE_SELECTORS.updateAudioData();
  const getOutputNodes = STORE_SELECTORS.getOutputNodes();
  const initAudioData = STORE_SELECTORS.initAudioData();
  const play = STORE_SELECTORS.playNodeEl();
  const setIsPlaying = STORE_SELECTORS.setIsPlaying();
  const isPlaying = STORE_SELECTORS.isPlaying();
  const nodeAudioData = STORE_SELECTORS.nodeAudioData();

  function onChange({ target: { files } }: ChangeEvent<HTMLInputElement>) {
    const data = nodeAudioData.get(id);
    if (!ref.current || !data)
      return console.warn("AudioTrackNode: ref is null");
    if (!files || !files[0]) return console.warn("No file selected");

    updateAudioData(id, {
      ...data,
      file: files[0],
    });
  }

  // Init audio objects on mount
  useEffect(() => {
    const el = ref.current;
    if (!el) return console.warn("AudioTrackNode: ref is null");

    initAudioData(id, el);
  }, [ref]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return console.warn("AudioTrackNode: ref is null");

    el.addEventListener("ended", () => {
      getOutputNodes(id).forEach(({ id }) => {
        play(id);
      });
    });

    return () => {
      el.removeEventListener("ended", () => {
        getOutputNodes(id).forEach(({ id }) => {
          play(id);
        });
      });
    };
  }, [ref, getOutputNodes]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return console.warn("AudioTrackNode: ref is null");

    !isPlaying && el.pause();
  }, [ref, isPlaying]);

  return (
    <ClipNodeWrapper>
      <Flex className="drag-handle" p={2} cursor="move">
        <Heading>{src}</Heading>
      </Flex>
      {/* <NodeResizer isVisible={selected} /> */}
    <Box bg="bg">
        <Waveform />
        <chakra.audio
          ref={ref}
          id={id}
          controls
          src={src}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </Box>
      <NodeToolbar>
        <FileUploadRoot accept="audio/*" onChange={onChange}>
          <FileInput />
        </FileUploadRoot>
      </NodeToolbar>
    </ClipNodeWrapper>
  );
}
