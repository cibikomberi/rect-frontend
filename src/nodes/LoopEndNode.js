import { Handle, Position } from "@xyflow/react";

const LoopEndNode = ({ data, isConnectable }) => {
    return (
        <div className="react-flow__node-custom">
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
                id="end"
            />

            <p className="node-title">Loop End</p>

        </div>
    );
}

export default LoopEndNode;