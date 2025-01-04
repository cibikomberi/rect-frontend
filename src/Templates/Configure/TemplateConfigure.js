import { Save } from "@carbon/icons-react";
import { Button, FileUploader, Tab, TabList, TabPanel, TabPanels, Tabs, TextArea, TextInput } from "@carbon/react";
import axios from "axios";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import DatastreamsList from "../../Components/DatastreamsList";
import AccessControlList from "../../Components/AccessControlList";

const TemplateConfigure = () => {
    const { template, metadata } = useLoaderData();
    console.log(template);

    const [name, setName] = useState(template.name);
    const [description, setDescription] = useState(template.description);
    const [image, setImage] = useState(null);
    const [datastreams, setDatastreams] = useState(metadata.datastreams);
    const [accessControls, setAccessControls] = useState(metadata.userAccess);
    // const reducer = (state, action) => {
    //     console.log(state);
    //     console.log(action);

    //     switch (action.type) {
    //         case 'setName':
    //             return ({ ...state, name: action.payload })
    //         case 'setDescription':
    //             return ({ ...state, description: action.payload })
    //         case 'setDatastreams':
    //             return ({ ...state, description: action.payload })
    //         case 'setTemplateAccessControls':
    //             return ({ ...state, description: action.payload })
    //         case 'openDataStreamModal':
    //             return ({ ...state, isDatastreamModalOpen: true })
    //         case 'openTemplateAccessControlModal':
    //             return ({ ...state, isTemplateAccessControlModalOpen: true })
    //         case 'closeDataStreamModal':
    //             return ({ ...state, isDatastreamModalOpen: false })
    //         case 'closeTemplateAccessControlModal':
    //             return ({ ...state, isTemplateAccessControlModalOpen: false })
    //         case 'setNewDatastreamId':
    //             return ({ ...state, newDatastream: { ...state.newDatastream, identifier: action.payload } })
    //         case 'setNewDatastreamName':
    //             return ({ ...state, newDatastream: { ...state.newDatastream, name: action.payload } })
    //         case 'setNewDatastreamType':
    //             return ({ ...state, newDatastream: { ...state.newDatastream, type: action.payload } })
    //         case 'setNewDatastreamUnit':
    //             return ({ ...state, newDatastream: { ...state.newDatastream, unit: action.payload } })
    //         case 'addDatastream':
    //             return ({ ...state, datastreams: [ ...state.datastreams, JSON.parse(JSON.stringify(state.newDatastream)) ] })

    //         default:
    //             break;
    //     }
    //     return state;
    // }
    // const [state, dispatch] = useReducer(reducer, {
    //     name,
    //     description,
    //     datastreams: metadata.datastreams,
    //     templateAccessControls: metadata.templateAccessControls,
    //     isDatastreamModalOpen: false,
    //     isTemplateAccessControlModalOpen: false,
    //     newDatastream: {},
    //     newAccessControl: {}
    // });


    // console.log(state);

    const updateTemplateInfo = () => {
        const data = new FormData();
        data.append('info', new Blob([JSON.stringify({
            name,
            description
        })], { type: "application/json" }));
        data.append('image', image);

        axios.put(`template/${template.id}`, data).then(res => console.log(res))
    }

    return (<>


        <Tabs>
            <TabList aria-label="List of tabs">
                <Tab>Info</Tab>
                <Tab>Datastreams</Tab>
                <Tab>Access Control</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <FileUploader
                        name=""
                        labelTitle=""
                        labelDescription=""
                        buttonLabel="Upload image"
                        buttonKind="primary"
                        size="md"
                        filenameStatus="edit"
                        accept={['.jpg', '.png']}
                        multiple={false}
                        disabled={false}
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                    <TextInput
                        id="input-name"
                        type="text"
                        labelText="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)} />
                    <TextArea
                        id="input-description"
                        type="text"
                        labelText="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)} />
                    <Button renderIcon={Save} onClick={() => updateTemplateInfo()}>Save</Button>

                </TabPanel>

                <TabPanel>
                    <DatastreamsList dataStreams={datastreams} setDatastreams={setDatastreams} templateOrDevice={"template"} templateOrDeviceId={template.id}/>
                </TabPanel>

                <TabPanel>
                    <AccessControlList accessControls={accessControls} setAccessControls={setAccessControls} templateOrDevice={"template"} templateOrDeviceId={template.id} />
                </TabPanel>
            </TabPanels>
        </Tabs>


    </>);
}

export const templateMetadataLoader = async (templateId) => {
    const template = await axios.get(`/template/${templateId}`)
        .then((res) => res.data)
    const metadata = await axios.get(`/template/metadata/${templateId}`)
        .then((res) => res.data)
    console.log(metadata);

    return { template, metadata };
}

export default TemplateConfigure;