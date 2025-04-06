import {
  ViewportPortal,
  useReactFlow,
  getStraightPath,
  useEdges,
  type XYPosition,
} from "@xyflow/react";

export default function EdgeInspector() {
  const { getNode } = useReactFlow();
  const edges = useEdges();

  return (
    <ViewportPortal>
      <div className="react-flow__devtools-nodeinspector">
        {edges.map((edge) => {
          const sourcePosition = getNode(edge.source)?.position;
          const targetPosition = getNode(edge.target)?.position;

          if (!(sourcePosition && targetPosition)) {
            console.warn(
              `Edge ${edge.id} has no source or target node. Skipping...`,
            );
            return null;
          }

          const [, labelX, labelY] = getStraightPath({
            sourceX: sourcePosition.x,
            sourceY: sourcePosition.y,
            targetX: targetPosition.x,
            targetY: targetPosition.y,
          });

          return (
            <EdgeInfo
              key={edge.id}
              id={edge.id}
              selected={!!edge.selected}
              type={edge.type || "default"}
              position={{ x: labelX, y: labelY }}
              // width={edge.measured?.width ?? 0}
              // height={edge.measured?.height ?? 0}
              data={edge.data}
            />
          );
        })}
      </div>
    </ViewportPortal>
  );
}

type EdgeInfoProps = {
  id: string;
  type: string;
  selected: boolean;
  position: XYPosition;
  data: any;
};

function EdgeInfo({
  id,
  type,
  selected,
  position: { x, y },
  data,
}: EdgeInfoProps) {
  return (
    <div
      className="react-flow__devtools-nodeinfo"
      style={{
        position: "absolute",
        transform: `translate(-50%, -50%) translate(${x}px,${y}px)`,
        pointerEvents: "all",
      }}
    >
      <div>id: {id}</div>
      <div>type: {type}</div>
      <div>selected: {selected ? "true" : "false"}</div>
      <div>
        position: {x.toFixed(1)}, {y.toFixed(1)}
      </div>
      <div>data: {JSON.stringify(data, null, 2)}</div>
    </div>
  );
}
