import { Handle, Position } from "@xyflow/react";

const SetupEndNode = ({ data, isConnectable }) => {
    return (
        <div className="react-flow__node-custom">
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
                id="end"
            />

            <p className="node-title">Setup End</p>

        </div>
    );
}

export default SetupEndNode;