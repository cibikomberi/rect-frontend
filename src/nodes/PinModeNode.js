import { Handle, Position } from "@xyflow/react";

const PinModeNode = ({ data, isConnectable }) => {

    return (
        <div className="react-flow__node-custom">
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
                id="1"
            />

            <div className="node-body">
                <p className="node-title">Pin Mode</p>
                <p className="node-content">{data.pin} ({data.pinMode})</p>
            </div>

            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
                id="2"
            />
        </div>
    );
}

export default PinModeNode;