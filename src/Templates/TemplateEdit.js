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
import { Button, HeaderPanel } from '@carbon/react';
import { Close } from '@carbon/icons-react';
import NodeDataEditorForSidebar, { EmptyDataForNodes } from '../Nodes/NodeDataEditorForSidebar';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { useLoaderData, useParams } from 'react-router-dom';

const nodeTypes = { delay: DelayNode, digitalWrite: DigitalWriteNode, setupStart: SetupStartNode, setupEnd: SetupEndNode, loopStart: LoopStartNode, loopEnd: LoopEndNode, pinMode: PinModeNode }

const TemplateEdit = () => {
    const [isPanelExpanded, setIsPanelExpanded] = useState(false);
    const [activeNode, setActiveNode] = useState(true);
    const [nodes, setNodes, onNodesChange] = useNodesState(useLoaderData().nodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(useLoaderData().edges);

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const addNode = (nodeType) => {
        let emptyData = EmptyDataForNodes(nodeType);
        const newNode = {
            id: `${nodeType}-${uuidv4()}`,
            position: { x: 0, y: 0 },
            data: { ...emptyData },
            type: nodeType,
            origin: [0.5, 0.0],
        };
        setNodes((nds) => nds.concat(newNode));
    }
    const {id} = useParams();
    const listAll = () => {
        const res = axios.post(`/templates/${id}/flow`,{
            nodes: nodes,
            edges: edges,
        })
        console.log(res);
    }

    const handleNodeClick = (_, node) => {
        setIsPanelExpanded(true);
        setActiveNode(node);
    }

    const Build = () => {

        const res = axios.post(`/device/flow/1/build`, {
            nodes: nodes,
            edges: edges,
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
                    // viewport={}
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
                children={
                    <>
                        <Button renderIcon={Close} kind="ghost" hasIconOnly iconDescription='close' onClick={() => setIsPanelExpanded(false)} />
                        <NodeDataEditorForSidebar activeNode={activeNode} setNodes={setNodes} />
                    </>}
            />
        </div>
    );
}

export const fetchFlows = async(id) => {
    const nodes = [
        { id: '1', position: { x: 0, y: 0 }, data: {}, type: 'setupStart' },
        { id: '3', position: { x: 200, y: 0 }, data: {}, type: 'setupEnd' },
        { id: '2', position: { x: 0, y: 200 }, data: {}, type: 'loopStart' },
        { id: '4', position: { x: 200, y: 200 }, data: {}, type: 'loopEnd' }
    ];
    
    const edges = [
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
    let flows = await axios.get(`template/flow/${id}`)
        .then((res) => res.data)
        .catch({nodes, edges})

        if (flows.nodes.length === 0) {
            flows = {nodes, edges}
        }
        console.log(flows);
        
    return flows;
}

export default TemplateEdit;