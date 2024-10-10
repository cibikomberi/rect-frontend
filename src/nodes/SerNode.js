import { Handle, Position } from '@xyflow/react';
import React from 'react';
// import 'reactflow/dist/style.css';

// Custom Node Component
const ServerNode = ({ data }) => {
  return (
    <div style={{
      padding: '10px',
      backgroundColor: '#f8f8f8',
      border: '1px solid #e2e2e2',
      borderRadius: '4px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '5px'
      }}>
        {/* Server Icon (You can use an icon library like FontAwesome) */}
        <span role="img" aria-label="server">🖥️</span>
        <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>Server</span>
      </div>
      <div style={{ color: '#333' }}>{data.ip}</div>
      {/* Handles for incoming and outgoing connections */}
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </div>
  );
};

// Registering the Custom Node
export default ServerNode;
