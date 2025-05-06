import { NodeProps, NodeResizer, NodeToolbar } from "@xyflow/react";
import { ChangeEvent, useEffect, useRef } from "react";

import useShallowStore, { type State } from "../../store";
import { FileInput, FileUploadRoot } from "../ui/file-upload";
import ClipNodeWrapper from "./ClipNodeWrapper";
import type { AudioClipNodeType } from "./types";

export default function AudioClipNode({
  id,
  data,
  selected,
}: NodeProps<AudioClipNodeType>) {
  const ref = useRef<HTMLAudioElement>(null);
  const { updateNodeData, getOutputNodes, createAudioNodeSource, play } =
    useShallowStore((s: State) => ({
      updateNodeData: s.updateNodeData,
      getOutputNodes: s.getOutputNodes,
      createAudioNodeSource: s.createAudioNodeSource,
      play: s.play,
    }));

  function onChange({ target: { files } }: ChangeEvent<HTMLInputElement>) {
    if (!ref.current) return console.warn("AudioTrackNode: ref is null");
    if (!files || !files[0]) return console.warn("No file selected");

    // https://reactflow.dev/examples/nodes/update-node, https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications#using_object_urls
    updateNodeData(id, {
      ...data,
      file: files[0],
    });
  }

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

  return (
    <ClipNodeWrapper>
      <NodeToolbar>
        <FileUploadRoot accept="audio/*" onChange={onChange}>
          <FileInput />
        </FileUploadRoot>
      </NodeToolbar>
      <NodeResizer isVisible={selected} />
      <audio ref={ref} id={id} controls src={data.src}></audio>
    </ClipNodeWrapper>
  );
}
