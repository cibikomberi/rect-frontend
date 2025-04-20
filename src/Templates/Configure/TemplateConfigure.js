import { Save } from "@carbon/icons-react";
import { Button, FileUploader, Tab, TabList, TabPanel, TabPanels, Tabs, TextArea, TextInput } from "@carbon/react";
import axios from "axios";
import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import DatastreamsList from "../../Components/DatastreamsList";
import AccessControlList from "../../Components/AccessControlList";

const TemplateConfigure = () => {
    const navigate = useNavigate();
    const { template, metadata } = useLoaderData();

    const myAccess = template.myAccess;
    const [name, setName] = useState(template.name);
    const [description, setDescription] = useState(template.description);
    const [image, setImage] = useState(null);
    const [dataStreams, setDatastreams] = useState(metadata.datastreams);
    const [accessControls, setAccessControls] = useState(metadata.userAccess);

    const updateTemplateInfo = () => {
        const data = new FormData();
        data.append('info', new Blob([JSON.stringify({
            name,
            description
        })], { type: "application/json" }));
        data.append('image', image);

        axios.put(`template/${template.id}`, data)
        .then(res => {
            if (res.status === 200) {
                navigate(-1)
        }})
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
                    {myAccess !== 'Viewer' && <FileUploader
                        name=""
                        labelTitle=""
                        labelDescription=""
                        buttonLabel="Upload image"
                        buttonKind="primary"
                        size="md"
                        filenameStatus="edit"
                        accept={['.jpg', '.png']}
                        multiple={false}
                        onChange={(e) => setImage(e.target.files[0])}
                    />}
                    <TextInput
                        id="input-name"
                        type="text"
                        labelText="Name"
                        value={name}
                        disabled={myAccess === 'Viewer'}
                        onChange={(e) => setName(e.target.value)} />
                    <TextArea
                        id="input-description"
                        type="text"
                        labelText="Description"
                        value={description || ''}
                        disabled={myAccess === 'Viewer'}
                        onChange={(e) => setDescription(e.target.value)} />
                    {myAccess !== 'Viewer' && <Button renderIcon={Save} onClick={() => updateTemplateInfo()}>Save</Button>}

                </TabPanel>

                <TabPanel>
                    <DatastreamsList isLocked={myAccess !== 'Viewer'} dataStreams={dataStreams} setDatastreams={setDatastreams} templateOrDevice={"template"} templateOrDeviceId={template.id}/>
                </TabPanel>

                <TabPanel>
                    <AccessControlList isLocked={myAccess !== 'Viewer'} accessControls={accessControls} setAccessControls={setAccessControls} templateOrDevice={"template"} templateOrDeviceId={template.id} />
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