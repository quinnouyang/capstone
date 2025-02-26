import { memo, ChangeEvent } from "react";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";

const ColorSelectorNode = memo(
  ({
    data,
    isConnectable,
  }: NodeProps<
    Node<{
      color: string;
      onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    }>
  >) => {
    return (
      <>
        <Handle
          type="target"
          position={Position.Left}
          onConnect={(params) => {
            console.log("handle onConnect", params);
          }}
          isConnectable={isConnectable}
        />
        <div>
          Custom Color Picker Node: <strong>{data.color}</strong>
        </div>
        <input
          className="nodrag"
          type="color"
          onChange={data.onChange}
          defaultValue={data.color}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="a"
          isConnectable={isConnectable}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="b"
          isConnectable={isConnectable}
        />
      </>
    );
  },
);

export default ColorSelectorNode;
