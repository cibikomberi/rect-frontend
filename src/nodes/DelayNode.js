import { Handle, Position } from "@xyflow/react";
import { useEffect, useState } from "react";

const DelayNode = ({ data, isConnectable }) => {
    const [delay, setDelay] = useState(0);

    useEffect(() => {
        data.updateData(data.id, 'delay', {
            delay: delay
        })
    }, [delay]);

    return (
        <div className="react-flow__node-custom">
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
                id="1"
            />

            <p className="node-title">Delay</p>
            
            <div className="node-body">
                <input
                    type="number"
                    value={delay}
                    onChange={(e) => setDelay(e.target.value)}
                />
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

export default DelayNode;