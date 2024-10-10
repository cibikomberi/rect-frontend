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
import ParametersForNodes from '../Nodes/ParametersForNodes';
import { Button, HeaderPanel, Select, SelectItem, TextInput } from '@carbon/react';
import { Close } from '@carbon/icons-react';


const nodeTypes = { delay: DelayNode, digitalWrite: DigitalWriteNode, setupStart: SetupStartNode, setupEnd: SetupEndNode, loopStart: LoopStartNode, loopEnd: LoopEndNode, pinMode: PinModeNode }

const initialNodes = [
    { id: '1', position: { x: 0, y: 0 }, data: {}, type: 'setupStart' },
    { id: '3', position: { x: 200, y: 0 }, data: {}, type: 'setupEnd' },
    { id: '2', position: { x: 0, y: 200 }, data: {}, type: 'loopStart' },
    { id: '4', position: { x: 200, y: 200 }, data: {}, type: 'loopEnd' }
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
    const parametersForNodes = ParametersForNodes;
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    console.log(parametersForNodes);

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const addNode = (nodeType) => {
        setK(k + 1);
        const newNode = {
            id: k.toString(),
            position: { x: 0, y: 0 },
            data: { data: nodes, id: k.toString() },
            type: nodeType,
            origin: [0.5, 0.0],
        };

        setNodes((nds) => nds.concat(newNode));
    }
    const listAll = () => {
        console.log(nodes);
        console.log(edges);
    }

    const handleNodeClick = (_, node) => {
        setIsPanelExpanded(true);
        setActiveNode(node);
    }

    const Build = () => {
        console.log(JSON.stringify({
            nodes: nodes,
            edges: edges,
        }));
        const formData = new FormData();
        formData.append('data', new Blob([JSON.stringify({
            'nodes': nodes,
        })], { type: "application/json" }))
        const res = fetch('http://localhost:8080/build', {
            method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
                nodes: nodes,
                edges: edges,
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
                children={
                    <>
                        <Button renderIcon={Close} kind="ghost" hasIconOnly onClick={() => setIsPanelExpanded(false)} />
                        {parametersForNodes.map((parameters) => {
                            if (parameters.type === activeNode.type) {
                                return parameters.inputs.map((inputs) => {
                                    if (inputs.type === 'number') {
                                        return <TextInput
                                            type="number"
                                            placeholder='Enter Value'
                                            style={{ width: '80%', backgroundColor: '#262626' }}
                                            onChange={(e) => {
                                                setNodes((prevNodes) => {
                                                    const newNodes = prevNodes.map((node) => {
                                                        if (node.id === activeNode.id) {
                                                            node.data[inputs.name] = e.target.value;
                                                        }
                                                        return node;
                                                    });
                                                    return newNodes;
                                                })
                                            }}
                                        />
                                    }
                                    if (inputs.type === 'select') {
                                        return <Select
                                            id={`select-1`}
                                            labelText="Select an option"
                                            helperText="Optional helper text"
                                            onChange={(e) => {
                                                setNodes((prevNodes) => {
                                                    const newNodes = prevNodes.map((node) => {
                                                        if (node.id === activeNode.id) {
                                                            node.data[inputs.name] = e.target.value;
                                                        }
                                                        return node;
                                                    });
                                                    return newNodes;
                                                })
                                            }}>
                                                {inputs.values.map((val) => {

                                                    return <SelectItem value={val} text={val} />
                                                })}
                                        </Select>
                                    }
                                })
                            }
                        })}

                    </>}
            />

        </div>
    );
}
export default TemplateEdit;