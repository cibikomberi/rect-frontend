import { Handle, Position } from "@xyflow/react";

const LoopStartNode = ({ data, isConnectable }) => {
    return (
        <div className="react-flow__node-custom">

            <p className="node-title">Loop Start</p>

            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
                id="start"
            />
        </div>
    );
}

export default LoopStartNode;