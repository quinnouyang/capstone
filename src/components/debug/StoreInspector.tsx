import STORE_SELECTORS from "../../store/store";

export default function StoreInspector() {
  const nodes = STORE_SELECTORS.nodes();
  const edges = STORE_SELECTORS.edges();
  const isPlaying = STORE_SELECTORS.isPlaying();
  const nodeCount = STORE_SELECTORS.nodeCount();
  const edgeCount = STORE_SELECTORS.edgeCount();
  const getOutputNodes = STORE_SELECTORS.getOutputNodes();
  const nodeAudiodata = STORE_SELECTORS.nodeAudioData();

  return (
    <div className="react-flow__devtools-changelogger">
      <div className="react-flow__devtools-title">Store Inspector</div>
      <div className="react-flow__devtools-nodeinspector">
        {nodeCount} nodes:
        {nodes.map(({ id, data }) => {
          return (
            <div key={id} className="react-flow__devtools-nodeinfo">
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
            <div key={id} className="react-flow__devtools-nodeinfo">
              <div>id: {id}</div>
              <div>source: {source}</div>
              <div>target: {target}</div>
              <br />
            </div>
          );
        })}
        <br />
        <div>isPlaying: {isPlaying ? "true" : "false"}</div>
        <div>nodeAudioData:</div>
        {Array.from(nodeAudiodata.entries()).map(([id, { file, el }]) => {
          return (
            <div key={id} className="react-flow__devtools-nodeinfo">
              <div>id: {id}</div>
              <div>file: {file.name}</div>
              <div>currTime: {el.currentTime}</div>
              <br />
            </div>
          );
        })}
      </div>
    </div>
  );
}
