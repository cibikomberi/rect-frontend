import { Save, TrashCan } from "@carbon/icons-react";
import { Button, Checkbox, FileUploader, Tab, TabList, TabPanel, TabPanels, Tabs, TextArea, TextInput } from "@carbon/react";
import axios from "axios";
import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import AccessControlList from "../Components/AccessControlList";
import DatastreamsList from "../Components/DatastreamsList";
import HeaderEditor from "../Components/HeaderEditor";
import Automations from "../Components/Automations";

const DeviceConfigure = () => {
    const { device, metadata } = useLoaderData();
    const navigate = useNavigate();
    const myAccess = device.myAccess;
    const [name, setName] = useState(device.name);
    const [description, setDescription] = useState(device.description);
    const [inheritTemplate, setInheritTemplate] = useState(device.inheritTemplate);
    const [isDevDevice, setIsDevDevice] = useState(device.isDevDevice);
    const [image, setImage] = useState(null);
    const [accessControls, setAccessControls] = useState(metadata.userAccess);
    const [dataStreams, setDatastreams] = useState(metadata.datastreams);

    const updateDeviceInfo = () => {
        const data = new FormData();
        data.append('info', new Blob([JSON.stringify( {
            name,
            description,
            inheritTemplate,
            isDevDevice
        })], { type: "application/json" }));
        data.append('image', image);
        axios.put(`device/${device.id}`, data).then(res => {
            if (res.status === 200) {
                navigate(-1);
                
            }
        })
    }

    const clearData = () => {
        axios.delete(`device/log/${device.id}`).then(res => {
            if (res.status === 200) {
                navigate(-1);

            }
        })
    }
    const deleteDevice = () => {
        axios.delete(`device/${device.id}`).then(res => {
            if (res.status === 200) {
                navigate(-2);
            }
        })
    }

    return (<>
        <Tabs>
            <TabList aria-label="List of tabs">
                <Tab>Info</Tab>
                <Tab>Datastreams</Tab>
                <Tab>Access Control</Tab>
                <Tab>Automations</Tab>
                {myAccess !== 'Viewer' && <Tab>Device constants</Tab>}
                {myAccess !== 'Viewer' && <Tab>Delete data</Tab>}
            </TabList>
            <TabPanels>
                <TabPanel>
                    {/* <FileUploader buttonLabel="Upload image" buttonKind="primary" size="md" filenameStatus="edit" accept={['.jpg', '.png']} multiple={false} disabled={false} name="" /> */}
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
                        disabled={false}
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
                        value={description || ""}
                        disabled={myAccess === 'Viewer'}
                        onChange={(e) => setDescription(e.target.value)} />
                    <Checkbox
                        id="checkbox-label-1"
                        labelText={`Apply changes from template`}
                        checked={inheritTemplate}
                        disabled={myAccess === 'Viewer'}
                        onChange={(e) => setInheritTemplate(e.target.checked)}
                    />
                    <Checkbox
                        id="checkbox-label-2"
                        labelText={`Is device under development(OTA updates are disabled)`}
                        checked={isDevDevice}
                        disabled={myAccess === 'Viewer'}
                        onChange={(e) => setIsDevDevice(e.target.checked)}
                    />
                    {myAccess !== 'Viewer' && <Button renderIcon={Save} onClick={updateDeviceInfo}>Save</Button>}
                </TabPanel>

                <TabPanel>
                    <DatastreamsList isLocked={myAccess !== 'Viewer'} dataStreams={dataStreams} setDatastreams={setDatastreams} templateOrDevice={"device"} templateOrDeviceId={device.id} />
                </TabPanel>

                <TabPanel>
                    <AccessControlList isLocked={myAccess !== 'Viewer'} accessControls={accessControls} setAccessControls={setAccessControls} templateOrDevice={"device"} templateOrDeviceId={device.id} />
                </TabPanel>
                <TabPanel>
                    <Automations isLocked={myAccess !== 'Viewer'} automations={metadata.automations} datastreams={dataStreams} />
                </TabPanel>
                {myAccess !== 'Viewer' && <TabPanel style={{ height: "80%" }}>
                    <HeaderEditor deviceId={device.id} templateId={device.templateId}/>
                </TabPanel>}
                {myAccess !== 'Viewer' && <TabPanel>
                    <h6>Clear log data</h6>
                    <Button onClick={clearData} renderIcon={TrashCan} kind="danger">Clear</Button>
                    <h6>Delete device</h6>
                    <Button onClick={deleteDevice} renderIcon={TrashCan} kind="danger">Delete</Button>
                </TabPanel>}
            </TabPanels>
        </Tabs>

    </>);
}

export const deviceMetadataLoader = async (deviceId) => {
    const device = await axios.get(`/device/${deviceId}`)
        .then((res) => res.data)
    const metadata = await axios.get(`/device/metadata/${deviceId}`)
        .then((res) => res.data)
    const devices = await axios.get('/devices').then((res) => res.data)
    const sharedDevices = await axios.get('/devices/shared').then((res) => res.data)
    return { device, metadata, deviceList: [...devices, ...sharedDevices] };
}

export default DeviceConfigure;