import { Button } from "@chakra-ui/react";
import { NodeProps, NodeResizer, NodeToolbar } from "@xyflow/react";
import { ChangeEvent, useEffect, useRef } from "react";

import useShallowStore, { type State } from "../../store";
import { FileInput, FileUploadRoot } from "../ui/file-upload";
import { Slider } from "../ui/slider";
import { formatTimestamp } from "../utils";
import ClipNodeWrapper from "./ClipNodeWrapper";
import type { ClipNodeType } from "./types";

export default function ClipNode({
  id,
  data,
  selected,
}: NodeProps<ClipNodeType>) {
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
      src: URL.createObjectURL(files[0]),
      el: ref.current,
      duration: ref.current.duration,
      currentTime: ref.current.currentTime,
    });
  }

  useEffect(() => {
    const el = ref.current;
    if (!el) return console.warn("AudioTrackNode: ref is null");

    createAudioNodeSource(el);
    updateNodeData(id, {
      ...data,
      el,
      duration: el.duration,
      currentTime: el.currentTime,
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
        <Button>TEST</Button>
      </NodeToolbar>
      <NodeResizer isVisible={selected} />
      <FileUploadRoot accept="audio/*" onChange={onChange}>
        <FileInput />
      </FileUploadRoot>
      <audio ref={ref} id={id} controls src={data.src}></audio>
      <Slider
        marks={[
          { value: 0, label: "0:00" },
          {
            value: data.duration || 100,
            label: formatTimestamp(data.duration || -1),
          },
        ]}
        value={[(() => data.currentTime)() || 0]}
        max={data.duration || 100}
      />
    </ClipNodeWrapper>
  );
}
