import { Select, SelectItem, TextInput } from "@carbon/react";
import ParametersForNodes from "./ParametersForNodes";

const parametersForNodes = ParametersForNodes;
const NodeDataEditorForSidebar = ({ activeNode, setNodes }) => {
console.log(activeNode)
    return (
        <>
            <h4>{activeNode.type}</h4>
            {parametersForNodes.map((parameters) => {

                if (parameters.type === activeNode.type) {
                    return parameters.inputs.map((inputs) => {

                        if (inputs.type === 'number') {
                            return <TextInput
                                type="number"
                                placeholder='Enter Value'
                                style={{ width: '80%', backgroundColor: '#262626' }}
                                value={activeNode.data[inputs.name]}
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
                                value={activeNode.data[inputs.name]}
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
                        return <></>
                    })
                }

                return <></>
            })}
        </>
    );
}

export const EmptyDataForNodes = (type) => {
    let emptyData = {}
    parametersForNodes.map((param) => {
        if (param.type === type) {
            param.inputs.map((input) => {
                if (input.type === 'number') {
                    emptyData[input.name] = 0;
                } else if (input.type === 'select') {
                    emptyData[input.name] = input.values[0];
                }
            })
        }
        return <></>
    })
    return emptyData;
}

export default NodeDataEditorForSidebar;