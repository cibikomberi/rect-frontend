import { Save } from "@carbon/icons-react";
import { Button, Checkbox, Tab, TabList, TabPanel, TabPanels, Tabs, TextArea, TextInput } from "@carbon/react";
import axios from "axios";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import DatastreamsList from "../Components/DatastreamsList";
import AccessControlList from "../Components/AccessControlList";

const DeviceConfigure = () => {
    const { device, metadata } = useLoaderData();
    console.log(device);
    
    const [name, setName] = useState(device.name);
    const [description, setDescription] = useState(device.description);
    const [inheritTemplate, setInheritTemplate] = useState(device.inheritTemplate);
    const [datastreams, setDatastreams] = useState(metadata.datastreams);
    const [accessControls, setAccessControls] = useState(metadata.accessControls);
    
    const updateDeviceInfo = () => {
        const info = {
            name,
            description,
            inheritTemplate
        }
        const metadata = {
            datastreams,
            accessControls
        }
        const data = new FormData();
        data.append('info',new Blob([JSON.stringify(info)], { type: "application/json" }));
        data.append('metadata',new Blob([JSON.stringify(metadata)], { type: "application/json" }));

        axios.put(`device/${device.id}`,data).then(res => console.log(res))
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
                    <Checkbox 
                        id="checkbox-label-1"
                        labelText={`Apply changes from template`} 
                        checked={inheritTemplate}
                        onChange={(e) => setInheritTemplate(e.target.checked)}
                    />
                </TabPanel>
                    
                <TabPanel>
                    <DatastreamsList dataStreams={datastreams} setDatastreams={setDatastreams} deviceId={device.id}/>
                </TabPanel>
                
                <TabPanel>
                    <AccessControlList accessControls={accessControls} setAccessControls={setAccessControls} />
                </TabPanel>
            </TabPanels>
        </Tabs>

        <Button renderIcon={Save} onClick={updateDeviceInfo}>Save</Button>
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