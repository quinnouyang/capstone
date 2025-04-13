import { useShallow } from "zustand/shallow";
import useCustomStore from "../../store";

export default function StoreInspector() {
  const {
    nodes,
    edges,
    nodeCount,
    edgeCount,
    ctx,
    isPlaying,
    nodeIdToEl,
    getOutputNodes,
  } = useCustomStore(useShallow((s) => s));

  return (
    <div className="react-flow__devtools-changelogger">
      <div className="react-flow__devtools-title">Store Inspector</div>
      <div className="react-flow__devtools-nodeinspector">
        {nodeCount} nodes:
        {nodes.map(({ id, data }) => {
          return (
            <div className="react-flow__devtools-nodeinfo">
              <div>id: {id}</div>
              <div>data: {JSON.stringify(data, null, 2)}</div>
              <div>
                outs:{" "}
                {getOutputNodes(id)
                  .map(({ id }) => id)
                  .join(", ")}
              </div>
              <br />
            </div>
          );
        })}
        <br />
        {edgeCount} edges:
        {edges.map(({ id, source, target }) => {
          return (
            <div className="react-flow__devtools-nodeinfo">
              <div>id: {id}</div>
              <div>source: {source}</div>
              <div>target: {target}</div>
              <br />
            </div>
          );
        })}
        <br />
        <div>Audio Context State: {ctx.state}</div>
        <div>isPlaying: {isPlaying ? "true" : "false"}</div>
        <div>Audio Elements:</div>
        {Array.from(nodeIdToEl.entries()).map(([id, el]) => {
          return (
            <div key={id} className="react-flow__devtools-nodeinfo">
              {id}:{" "}
              {JSON.stringify(
                el,
                ["src", "currentTime", "duration", "ended", "playing"],
                2,
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
