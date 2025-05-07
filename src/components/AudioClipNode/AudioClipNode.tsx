import { NodeProps, NodeResizer, NodeToolbar } from "@xyflow/react";
import { ChangeEvent, useEffect, useRef } from "react";

import STORE_SELECTORS from "../../store/store";
import { FileInput, FileUploadRoot } from "../ui/file-upload";
import ClipNodeWrapper from "./ClipNodeWrapper";
import type { AudioClipNodeType } from "./types";

export default function AudioClipNode({
  id,
  data,
  selected,
}: NodeProps<AudioClipNodeType>) {
  const ref = useRef<HTMLAudioElement>(null);

  const updateNodeData = STORE_SELECTORS.updateNodeData();
  const getOutputNodes = STORE_SELECTORS.getOutputNodes();
  const createAudioNodeSource = STORE_SELECTORS.createAudioNodeSource();
  const play = STORE_SELECTORS.playNode();
  const setIsPlaying = STORE_SELECTORS.setIsPlaying();
  const isPlaying = STORE_SELECTORS.isPlaying();

  function onChange({ target: { files } }: ChangeEvent<HTMLInputElement>) {
    if (!ref.current) return console.warn("AudioTrackNode: ref is null");
    if (!files || !files[0]) return console.warn("No file selected");

    updateNodeData(id, {
      ...data,
      src: URL.createObjectURL(files[0]),
      file: files[0],
    });
  }

  // Init connect to ctx
  useEffect(() => {
    const el = ref.current;
    if (!el) return console.warn("AudioTrackNode: ref is null");

    updateNodeData(id, {
      ...data,
      srcNode: createAudioNodeSource(el),
    });
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
      <NodeToolbar>
        <FileUploadRoot accept="audio/*" onChange={onChange}>
          <FileInput />
        </FileUploadRoot>
      </NodeToolbar>
      <NodeResizer isVisible={selected} />
      <audio
        ref={ref}
        id={id}
        controls
        src={data.src}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </ClipNodeWrapper>
  );
}
