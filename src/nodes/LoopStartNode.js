import { Repeat } from "@carbon/icons-react";
import { Handle, Position } from "@xyflow/react";

const LoopStartNode = ({ data, isConnectable }) => {
    return (
        <>
            <Repeat />
            <div className="node-body">
                <p className="node-title">Loop Start</p>
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

export default LoopStartNode;