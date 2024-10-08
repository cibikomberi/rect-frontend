import { Handle, Position } from "@xyflow/react";
import { useEffect, useState } from "react";

const DigitalWriteNode = ({ data, isConnectable }) => {
    const [pin, setPin] = useState(0);
    const [pinState, setPinState] = useState("High");

    useEffect(() => {
        data.updateData(data.id, 'digitalWrite', {
            pin: pin,
            pinState: pinState
        })
    },[pin, pinState]);
    return ( 
        <div className="react-flow__node-custom">
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
                id="1"
            />

            <p>Digital Write</p>
            <input
                type="number"
                placeholder="Digital Pin"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
            />
            <select 
                value={pinState}
                onChange={(e) => setPinState(e.target.value)}
            >
                <option value="High">High</option>
                <option value="Low">Low</option>
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
 
export default DigitalWriteNode;