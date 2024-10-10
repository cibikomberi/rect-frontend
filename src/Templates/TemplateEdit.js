import React, { useCallback, useState } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import DelayNode from '../Nodes/DelayNode';
import DigitalWriteNode from '../Nodes/DigitalWriteNode';
import SetupStartNode from '../Nodes/SetupStartNode';
import SetupEndNode from '../Nodes/SetupEndNode';
import LoopStartNode from '../Nodes/LoopStartNode';
import LoopEndNode from '../Nodes/LoopEndNode';
import PinModeNode from '../Nodes/PinModeNode';
import { HeaderPanel, TextInput } from '@carbon/react';


const nodeTypes = { delay: DelayNode, digitalWrite: DigitalWriteNode, setupStart: SetupStartNode, setupEnd: SetupEndNode, loopStart: LoopStartNode, loopEnd: LoopEndNode, pinMode: PinModeNode }

const initialNodes = [
    { id: '1', position: { x: 0, y: 0 }, data: { label: '1' }, type: 'setupStart' },
    { id: '3', position: { x: 200, y: 0 }, data: { label: '2' }, type: 'setupEnd' },
    { id: '2', position: { x: 0, y: 200 }, data: { label: '2' }, type: 'loopStart' },
    { id: '4', position: { x: 200, y: 200 }, data: { label: '2' }, type: 'loopEnd' }
];

const initialEdges = [
    {
        "source": "1",
        "sourceHandle": "start",
        "target": "3",
        "targetHandle": "end",
        "id": "xy-edge__1start-3end",
        "selected": false,
        animated: true
    }
]

const TemplateEdit = () => {
    const [k, setK] = useState(5);
    const [isPanelExpanded, setIsPanelExpanded] = useState(false);
    const [activeNode, setActiveNode] = useState(true);
    const [data, setData] = useState([]);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const updateData = (id, type, values) => {
        setData((data) => data.filter((a) => a.id !== id).concat({
            id: id,
            type: type,
            data: values
        }))
    }

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const addNode = (nodeType) => {
        setK(k + 1);
        const newNode = {
            id: k.toString(),
            position: { x: 0, y: 0 },
            data: { data: data, updateData: updateData, id: k },
            type: nodeType,
            origin: [0.5, 0.0],
        };

        setNodes((nds) => nds.concat(newNode));
    }
    const listAll = () => {
        console.log(data);
        console.log(edges);
    }

    const handleNodeClick = (_, node) =>{
        setIsPanelExpanded(true);
        setActiveNode(node);
    }

    const Build = () => {
        console.log(JSON.stringify({
            nodes: nodes,
            edges: edges,
            data: data
        }));
        const formData = new FormData();
        formData.append('data', new Blob([JSON.stringify({
            'nodes': nodes,
        })], { type: "application/json" }))
        const res = fetch('http://localhost:8080/build', {
            method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
                nodes: nodes,
                edges: edges,
                data: data
            })
        })
        console.log(res);

    }

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex' }}>
            <div style={{ width: '16rem', height: '100%', backgroundColor: '#161616' }}>
                <button onClick={() => addNode('delay')}> Add delay node </button>
                <button onClick={() => addNode('digitalWrite')}> Add digital write node </button>
                <button onClick={() => addNode('pinMode')}> Add Pin Mode node </button>
                <button onClick={listAll}> listAll </button>
                <button onClick={Build}> Build </button>
            </div>
            <div style={{ width: 'calc(100% - 16rem)', height: '100%' }}>
                <ReactFlow
                    nodeTypes={nodeTypes}
                    colorMode="dark"
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}

                    onNodeClick={handleNodeClick}
                >
                    <Controls />
                    <MiniMap />
                    <Background variant="dots" gap={20} size={2} />
                </ReactFlow>
            </div>
            <HeaderPanel
                expanded={isPanelExpanded}
                children={<>
                    {activeNode.id}
                    <TextInput id="text-input-1" type="text" placeholder='Enter Value' style={{width: '80%', backgroundColor:'#262626'}} />
                </>}
            />

        </div>
    );
}
export default TemplateEdit;