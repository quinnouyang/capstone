import {
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  SelectionMode,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useShallow } from "zustand/shallow";

import useCustomStore from "../store";
import { NODE_TYPES } from "./consts";
import DevTools from "./debug/Devtools";
import { ColorModeButton, useColorMode } from "./ui/color-mode";

/**
 * Issues
 * - Initial rerender from `onNodesChange` (when `INIT_NODES` is not empty) and `screenToFlowPosition`
 */

export default function Canvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useCustomStore(
      useShallow((s) => ({
        nodes: s.nodes,
        edges: s.edges,
        onNodesChange: s.onNodesChange,
        onEdgesChange: s.onEdgesChange,
        onConnect: s.onConnect,
      })),
    );

  const { colorMode } = useColorMode(); // [Bug] Redundant rerender

  return (
    <ReactFlow
      colorMode={colorMode} // [Bug] Redundant rerender
      nodes={nodes}
      edges={edges}
      fitView
      fitViewOptions={{ maxZoom: 1 }}
      onNodesChange={onNodesChange} // [Bug] Redundant rerender
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
