import { NodeProps, NodeToolbar } from "@xyflow/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";

import { Box, chakra, Flex, Heading } from "@chakra-ui/react";
import STORE_SELECTORS from "../../store/store";
import type { AudioClipData } from "../../store/webAudio";
import { FileInput, FileUploadRoot } from "../ui/file-upload";
import ClipNodeWrapper from "./ClipNodeWrapper";
import Waveform from "./Waveform";
import type { AudioClipNodeType } from "./utils";

type AudioClipData = {
  file: File;
  el: HTMLAudioElement;
  srcNode: MediaElementAudioSourceNode;
};

export default function AudioClipNode({
  id,
  data: { src },
}: NodeProps<AudioClipNodeType>) {
  const ref = useRef<HTMLAudioElement>(null);

  // const initData = STORE_SELECTORS.initData();
  // const updateData = STORE_SELECTORS.updateData();
  // const getData = STORE_SELECTORS.getData();
  const [data, setData] = useState<AudioClipData | null>(null);

  const ctx = STORE_SELECTORS.ctx();
  const getOutputNodes = STORE_SELECTORS.getOutputNodes();

  const play = STORE_SELECTORS.playNodeEl();
  const setIsPlaying = STORE_SELECTORS.setIsPlaying();
  const isPlaying = STORE_SELECTORS.isPlaying();

  const [isLoading, setIsLoading] = useState(true);
  const [isInit, setIsInit] = useState(false);
  console.log(isLoading, data);

  function onChange({ target: { files } }: ChangeEvent<HTMLInputElement>) {
    if (!ref.current || !data)
      return console.warn("AudioTrackNode: ref is null");
    if (!files || !files[0]) return console.warn("No file selected");

    setIsLoading(true);
    // updateData(id, {
    //   ...data,
    //   file: files[0],
    // });
    setIsLoading(false);
  }

  // Init `srcNode` on mount
  useEffect(() => {
    const el = ref.current;
    if (!el) return console.warn("AudioTrackNode: ref is null");

    if (isInit) return;
    setIsInit(true);

    console.trace();
    const srcNode = ctx.createMediaElementSource(el);
    srcNode.connect(ctx.destination);

    async () => {
      setData({
        file: new File([await (await fetch(el.src)).blob()], "init " + el.src),
        el,
        srcNode,
      });
    };
    setIsLoading(false);
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
        {!isLoading && data && <Waveform />}
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
