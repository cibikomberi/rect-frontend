import { Power } from "@carbon/icons-react";
import { Handle, Position } from "@xyflow/react";

const SetupStartNode = ({ data, isConnectable }) => {
    return (
        <>
            <Power />
            <div className="node-body">
                <p className="node-title">Setup Start</p>
                <p className="node-content">Setup Start</p>
            </div>

            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
                id="start"
            />
        </>
    );
}

export default SetupStartNode;