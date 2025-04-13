import { useEffect, useRef, useState } from "react";

import {
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  SelectionMode,
  type ColorMode as FlowColorMode,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import {
  ColorModeButton,
  useColorMode as useChakraColorMode,
} from "./ui/color-mode";

import { shallow } from "zustand/shallow";
import useCustomStore from "../store";
import { NODE_TYPES } from "./consts";
import DevTools from "./debug/Devtools";

/**
 * Issues
 * - Initial rerender from `onNodesChange` (when `INIT_NODES` is not empty) and `screenToFlowPosition`
 */

export default function NodeCanvas() {
  const ref = useRef<HTMLDivElement>(null);

  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useCustomStore((state) => state, shallow);

  const { colorMode: chakraColorMode } = useChakraColorMode();
  const [flowColorMode, setFlowColorMode] =
    useState<FlowColorMode>(chakraColorMode);

  // Sync Chakra and ReactFlow color modes
  useEffect(() => {
    setFlowColorMode(chakraColorMode);
  }, [chakraColorMode]);

  return (
    <ReactFlow
      ref={ref}
      colorMode={flowColorMode}
      nodes={nodes}
      edges={edges}
      fitView
      fitViewOptions={{ maxZoom: 1 }}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={NODE_TYPES}
      panOnScroll
      selectionOnDrag
      selectionMode={SelectionMode.Partial}
      zoomOnDoubleClick={false}
      proOptions={{ hideAttribution: true }}
    >
      <Panel position="top-right">
        <ColorModeButton />
      </Panel>
      <MiniMap />
      <Controls style={{ color: "gray" }} />
      <Background />
      <DevTools />
    </ReactFlow>
  );
}
