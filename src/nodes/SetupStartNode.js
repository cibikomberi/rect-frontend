import { Handle, Position } from "@xyflow/react";

const SetupStartNode = ({ data, isConnectable }) => {
    return ( 
        <div className="react-flow__node-custom">

            <h3>Setup Start</h3>
            
            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
                id="start"
            />
        </div>
     );
}
 
export default SetupStartNode;