/**
 * Implements audio clip nodes in graph.
 * Utilizes web audio to create audio functionality (see WebAudioSlice) and
 * React for UI (see ReactFlowSlice).
 */

import { NodeProps, NodeToolbar } from "@xyflow/react";
import { useEffect, useRef } from "react";

import {
  Box,
  chakra,
  Flex,
  Heading,
  type FileUploadFileChangeDetails,
} from "@chakra-ui/react";
import STORE_SELECTORS from "../../store/store";
import { FileInput, FileUploadRoot } from "../ui/file-upload";
import ClipNodeWrapper from "./ClipNodeWrapper";
import type { AudioClipNodeType } from "./utils";

export default function AudioClipNode({
  id,
  data: { src },
}: NodeProps<AudioClipNodeType>) {
  const ref = useRef<HTMLAudioElement>(null);

  const initAudioData = STORE_SELECTORS.initAudioData();
  const updateAudioData = STORE_SELECTORS.updateAudioData();
  const nodeAudioData = STORE_SELECTORS.nodeAudioData();
  // const getOutputNodes = STORE_SELECTORS.getOutputNodes();

  const setIsPlaying = STORE_SELECTORS.setIsPlaying();
  const isPlaying = STORE_SELECTORS.isPlaying();

  // File change
  function onChange({ acceptedFiles: files }: FileUploadFileChangeDetails) {
    const data = nodeAudioData.get(id);

    if (!ref.current || !data)
      return console.warn("AudioTrackNode: ref is null");
    if (!files || !files[0]) return console.warn("No file selected");

    updateAudioData(id, { file: files[0] });
  }

  // Init `srcNode` on mount
  useEffect(() => {
    const el = ref.current;
    if (!el) return console.warn("AudioTrackNode: ref is null");

    void initAudioData(id, el);
  }, [id, initAudioData]);

  // TODO: Figure out why we needed this event listener
  // useEffect(() => {
  //   const el = ref.current;
  //   if (!el) return console.warn("AudioTrackNode: ref is null");

  //   const onEnded = () => {
  //     getOutputNodes(id).forEach(({ id }) => {
  //       play(id);
  //     });
  //   };
  //   el.addEventListener("ended", onEnded);

  //   return () => {
  //     el.removeEventListener("ended", onEnded);
  //   };
  // }, [ref, getOutputNodes]);

  // // Pause node if global isPlaying false (pausing one node pauses others)
  useEffect(() => {
    const el = ref.current;
    if (!el) return console.warn("AudioTrackNode: ref is null");

    if (!isPlaying) el.pause();
  }, [ref, isPlaying]);

  return (
    <ClipNodeWrapper>
      <Flex className="drag-handle" p={2} cursor="move">
        <Heading>{src}</Heading>
      </Flex>
      {/* <NodeResizer isVisible={selected} /> */}
      <Box bg="bg" minW={400}>
        <chakra.audio
          ref={ref}
          id={id}
          controls
          w={"full"}
          src={src}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </Box>
      <NodeToolbar>
        <FileUploadRoot accept="audio/*" onFileChange={onChange}>
          <FileInput />
        </FileUploadRoot>
      </NodeToolbar>
    </ClipNodeWrapper>
  );
}
