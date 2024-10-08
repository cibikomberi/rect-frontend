import { Handle, Position } from "@xyflow/react";
import { useEffect, useState } from "react";

const PinModeNode = ({ data, isConnectable }) => {
    const [pin, setPin] = useState(0);
    const [mode, setMode] = useState("High");

    useEffect(() => {
        data.updateData(data.id, 'pinMode', {
            pin: pin,
            mode: mode
        })
    },[pin, mode]);
    return ( 
        <div className="react-flow__node-custom">
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
                id="1"
            />

            <p>Pin Mode</p>
            <input
                type="number"
                placeholder="Digital Pin"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
            />
            <select 
                value={mode}
                onChange={(e) => setMode(e.target.value)}
            >
                <option value="Input">Input</option>
                <option value="Output">Output</option>
            </select>
            
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