import { ArrowUpRight, FlowData, SettingsEdit, Share, Upload } from '@carbon/icons-react';
import { Button, ComboBox, Dropdown, Modal, Tile } from '@carbon/react';
import axios from 'axios';
import { Link, useLoaderData } from 'react-router-dom';
import esp from '../images/esp32-wroom-32.jpg';
import { isLessThan30Seconds, timeDifference } from '../Methods/Time';
import { useEffect, useState } from "react";
import bg from "./../Assets/bg.jpeg";

const DeviceView = () => {
    const {device:{ id, name, lastActiveTime, description, templateName, dashboardId }, time} = useLoaderData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchPeople, setSearchPeople] = useState('');
    const [people, setPeople] = useState([]);
    const [user, setUser] = useState([]);
    const [accessControlLevel, setAccessControlLevel] = useState('');

    useEffect(() => {
        if (searchPeople.length > 2) {
            const ourRequest = axios.CancelToken.source() // <-- 1st step

            axios.get(`/friends?param=${searchPeople}`, {
                cancelToken: ourRequest.token,
            }).then(function (res) {
                setPeople(res.data);
            });
            return () => {
                ourRequest.cancel()
            }
        }
    }, [searchPeople])

    const addNewAccesscontrol = () => {
        axios.post(`/device/userAccess/${id}`, {
            user: user.id,
            access: accessControlLevel.name
        })
        setIsModalOpen(false)
        setAccessControlLevel('')
    }
    return (
        <div style={{ display: 'flex', justifyContent: "space-between", height: "100%" }}>
            <div style={{ width: "48%", height:"100%" }}>
                <img src={esp} style={{ maxWidth: '90%', maxHeight:"50%" }} alt="logo"></img>
                <h2>{name}</h2>
                <p>{description}</p>
            </div>

            <div style={{ width: "48%" }}>
                <div>
                    <div style={{ display: "flex", flexWrap: "wrap", border: "1px solid #262626" }}>
                        <Tile id="tile-1" style={{ flexGrow: "1", minWidth: "200px", border: "1px solid #262626" }}>
                            <h4>Status</h4>
                            <p>{isLessThan30Seconds(new Date(time), new Date(lastActiveTime)) ? 'Online' : 'Offline'}</p>
                        </Tile>
                        <Tile id="tile-1" style={{ flexGrow: "1", minWidth: "200px", border: "1px solid #262626" }}>
                            <h4>Last Active</h4>
                            <p>{timeDifference(new Date(time), new Date(lastActiveTime))}</p>
                        </Tile>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", border: "1px solid #262626" }}>
                        <Tile id="tile-1" style={{ flexGrow: "1", minWidth: "200px", border: "1px solid #262626" }}>
                            <h4>Template</h4>
                            <p>{templateName}</p>
                        </Tile>
                        <Tile id="tile-1" style={{ flexGrow: "1", minWidth: "200px", border: "1px solid #262626" }}>
                            <h4>Last Active</h4>
                            <p>5 minutes ago</p>
                        </Tile>
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", flexWrap:"wrap"}}>

                    <Button kind="ghost" iconDescription="Share this device with others" renderIcon={Share} hasIconOnly={true} onClick={() => setIsModalOpen(true)}></Button>
                    <Button kind="ghost" iconDescription='OTA updates' renderIcon={Upload} hasIconOnly={true}></Button>
                    <Button kind="ghost" iconDescription='Edit flows' renderIcon={FlowData} hasIconOnly={true}></Button>
                    <Button as={Link} to={'./../configure'} kind="ghost" iconDescription='Configure device' renderIcon={SettingsEdit} hasIconOnly={true}></Button>
                    <Button renderIcon={ArrowUpRight} as={Link} to={`/dashboard/${dashboardId}/edit`} target="_blank">Edit Dashboard</Button> 
                </div>
            </div>

            <Modal open={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                onRequestSubmit={() => addNewAccesscontrol()}
                modalHeading="Share"
                primaryButtonText="Share"
                secondaryButtonText="Cancel"
                hasScrollingContent={false}
            >
                <ComboBox
                    autoAlign
                    id="carbon-combobox"
                    items={people}
                    value={user?.name}
                    onChange={(e) => setUser(e.selectedItem)}
                    itemToElement={(item) =>
                        <div><img src={bg} style={{ height: "90%", width: "25px", borderRadius: "50%" }} alt="profile pic" />{item.name}</div>}
                    itemToString={(item) => (item ? item.name : '')}
                    titleText="Email"
                    onInputChange={(e) => {
                        setSearchPeople(e);
                        setUser(e.selectedItem);
                    }}
                />

                <Dropdown
                    autoAlign
                    id="datastream-type-input"
                    label="Access"
                    titleText="Access"
                    value={accessControlLevel}
                    onChange={(e) => setAccessControlLevel(e.selectedItem)}
                    items={[{
                        id: 'one',
                        label: 'Editor',
                        name: 'Editor'
                    }, {
                        id: 'three',
                        label: 'Viewer',
                        name: 'Viewer'
                    }, {
                        id: 'four',
                        label: 'None',
                        name: 'None'
                    }]}
                    style={{
                        marginBottom: '1rem'
                    }} />
            </Modal>
        </div>
    );
}

export const deviceDetailsLoader = async (ideviceId) => {
    const device = await axios.get(`/device/${ideviceId}`)
        .then((res) => res.data)
    const time = await axios.get(`/time`)
        .then((res) => res.data)
    return {device, time};
}

export default DeviceView;