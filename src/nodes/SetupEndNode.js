import { Power } from "@carbon/icons-react";
import { Handle, Position } from "@xyflow/react";

const SetupEndNode = ({ data, isConnectable }) => {
    return (
        <>
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
                id="end"
            />

            <Power />
            
            <div className="node-body">
                <p className="node-title">Setup End</p>
            </div>
        </>
    );
}

export default SetupEndNode;