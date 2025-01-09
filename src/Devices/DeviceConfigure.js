import { Save, TrashCan } from "@carbon/icons-react";
import { Button, Checkbox, FileUploader, Tab, TabList, TabPanel, TabPanels, Tabs, TextArea, TextInput } from "@carbon/react";
import axios from "axios";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import AccessControlList from "../Components/AccessControlList";
import DatastreamsList from "../Components/DatastreamsList";
import HeaderEditor from "../Components/HeaderEditor";

const DeviceConfigure = () => {
    const { device, metadata } = useLoaderData();

    const [name, setName] = useState(device.name);
    const [description, setDescription] = useState(device.description);
    const [inheritTemplate, setInheritTemplate] = useState(device.inheritTemplate);
    const [image, setImage] = useState(null);
    const [accessControls, setAccessControls] = useState(metadata.userAccess);

    const updateDeviceInfo = () => {
        const data = new FormData();
        data.append('info', new Blob([JSON.stringify( {
            name,
            description,
            inheritTemplate
        })], { type: "application/json" }));
        data.append('image', image);
        axios.put(`device/${device.id}`, data).then(res => console.log(res))
    }

    return (<>
        <Tabs>
            <TabList aria-label="List of tabs">
                <Tab>Info</Tab>
                <Tab>Datastreams</Tab>
                <Tab>Access Control</Tab>
                <Tab>Device constants</Tab>
                <Tab>Delete data</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    {/* <FileUploader buttonLabel="Upload image" buttonKind="primary" size="md" filenameStatus="edit" accept={['.jpg', '.png']} multiple={false} disabled={false} name="" /> */}
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
                        value={description || ""}
                        onChange={(e) => setDescription(e.target.value)} />
                    <Checkbox
                        id="checkbox-label-1"
                        labelText={`Apply changes from template`}
                        checked={inheritTemplate}
                        onChange={(e) => setInheritTemplate(e.target.checked)}
                    />
                    <Button renderIcon={Save} onClick={updateDeviceInfo}>Save</Button>
                </TabPanel>

                <TabPanel>
                    <DatastreamsList data={metadata.datastreams} templateOrDevice={"device"} templateOrDeviceId={device.id} />
                </TabPanel>

                <TabPanel>
                    <AccessControlList accessControls={accessControls} setAccessControls={setAccessControls} templateOrDevice={"device"} templateOrDeviceId={device.id} />
                </TabPanel>
                <TabPanel style={{ height: "80%" }}>
                    <HeaderEditor deviceId={device.id}/>
                </TabPanel>
                <TabPanel>
                    <h6>Clear log data</h6>
                    <Button renderIcon={TrashCan} kind="danger">Clear</Button>
                    <h6>Delete device</h6>
                    <Button renderIcon={TrashCan} kind="danger">Delete</Button>
                </TabPanel>
            </TabPanels>
        </Tabs>

    </>);
}

export const deviceMetadataLoader = async (deviceId) => {
    const device = await axios.get(`/device/${deviceId}`)
        .then((res) => res.data)
    const metadata = await axios.get(`/device/metadata/${deviceId}`)
        .then((res) => res.data)

    return { device, metadata };
}

export default DeviceConfigure;