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

            <h3>Setup End</h3>

        </div>
    );
}

export default SetupEndNode;