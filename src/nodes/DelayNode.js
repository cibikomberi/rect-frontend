import { Time } from "@carbon/icons-react";
import { Handle, Position } from "@xyflow/react";

const DelayNode = ({ data, isConnectable }) => {

    return (
        <>
            <Time />
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
                id="1"
            />

            <div className="node-body">
                <p className="node-title">Delay</p>
                <p className="node-content">{data.delay}</p>
            </div>

            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
                id="2"
            />
        </>
    );
}

export default DelayNode;