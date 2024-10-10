import { Repeat } from "@carbon/icons-react";
import { Handle, Position } from "@xyflow/react";

const LoopEndNode = ({ data, isConnectable }) => {
    return (
        <>
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
                id="end"
            />

            <Repeat />

            <div className="node-body">
                <p className="node-title">Loop End</p>
            </div>
        </>
    );
}

export default LoopEndNode;