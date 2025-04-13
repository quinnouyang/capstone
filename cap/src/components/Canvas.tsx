import { useRef } from "react";

import {
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  SelectionMode,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { ColorModeButton, useColorMode } from "./ui/color-mode";

import { shallow } from "zustand/shallow";
import useCustomStore from "../store";
import { NODE_TYPES } from "./consts";
import DevTools from "./debug/Devtools";

/**
 * Issues
 * - Initial rerender from `onNodesChange` (when `INIT_NODES` is not empty) and `screenToFlowPosition`
 */

export default function Canvas() {
  const ref = useRef<HTMLDivElement>(null);

  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useCustomStore((state) => state, shallow);

  const { colorMode } = useColorMode();

  console.log(colorMode);

  return (
    <ReactFlow
      ref={ref}
      colorMode={colorMode}
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
      <Controls />
      <Background />
      <DevTools />
    </ReactFlow>
  );
}
