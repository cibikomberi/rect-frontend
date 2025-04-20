import { ArrowUpRight, Dashboard, SettingsEdit, Share, Upload } from '@carbon/icons-react';
import { Button, ComboBox, Dropdown, FileUploaderDropContainer, FileUploaderItem, Modal, Tag, TextInput, Tile } from '@carbon/react';
import axios from 'axios';
import { useEffect, useState } from "react";
import { Link, useLoaderData } from 'react-router-dom';
import esp from '../Assets/esp32-wroom-32.jpg';
import { timeDifference } from '../Methods/Time';
import bg from "./../Assets/bg.jpeg";

const DeviceView = () => {
    const { device: { id, name, lastActiveTime, description, templateId, templateName, dashboardId, myAccess, image, isUpToDate, status, isDevDevice }, time } = useLoaderData();
    const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
    const [isOTAModalOpen, setIsOTAModalOpen] = useState(false);
    const [otaFile, setOtaFile] = useState(undefined);
    const [version, setVersion] = useState('');

    const [searchPeople, setSearchPeople] = useState('');
    const [people, setPeople] = useState([]);
    const [user, setUser] = useState([]);
    const [accessControlLevel, setAccessControlLevel] = useState('');

    console.log(image);

    useEffect(() => {
        if (searchPeople.length > 2) {
            const ourRequest = axios.CancelToken.source()

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
        setIsAccessModalOpen(false)
        setAccessControlLevel('')
    }

    const uploadOTAfile = () => {
        const data = new FormData();
        data.append('file', otaFile);
        data.append('version', new Blob([JSON.stringify({ version })], { type: "application/json" }));
        axios.post(`/device/ota/${id}`, data)
        setIsOTAModalOpen(false)
        // setAccessControlLevel('')
    }
    return (
        <div style={{ display: 'flex', justifyContent: "space-between", height: "100%" }}>
            <div style={{ width: "48%", height: "100%" }}>
                <h3 style={{ marginBottom: "15px" }}>Device details</h3>
                <img src={image} style={{ maxWidth: '90%', maxHeight: "50%" }} alt="logo"></img>
                <h2>{name}{isDevDevice && <Tag className="some-class" type='gray'>
                    {'Dev'}
                </Tag>}</h2>
                <p>{description}</p>
            </div>

            <div style={{ width: "48%" }}>
                <div>
                    <div style={{ display: "flex", flexWrap: "wrap", border: "1px solid #262626" }}>
                        <Tile id="tile-1" style={{ flexGrow: "1", minWidth: "200px", border: "1px solid #262626" }}>
                            <h4>Status</h4>
                            <p>{status.toLowerCase() === 'online' ? <strong style={{ color: "#61EC6D" }}>Online</strong> : <strong style={{ color: "#FF5058" }}>Offline</strong>}</p>
                        </Tile>
                        <Tile id="tile-1" style={{ flexGrow: "1", minWidth: "200px", border: "1px solid #262626" }}>
                            <h4>Last Active</h4>
                            <p>{status.toLowerCase() === 'online' ? "<1min" : timeDifference(new Date(time), new Date(lastActiveTime))}</p>
                        </Tile>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", border: "1px solid #262626" }}>
                        <Tile id="tile-1" style={{ flexGrow: "1", minWidth: "200px", border: "1px solid #262626" }}>
                            <h4>Template</h4>
                            <Link to={`/templates/${templateId}/view`}><p style={{ textDecoration: "unset" }}>{templateName}</p></Link>
                        </Tile>
                        <Tile id="tile-1" style={{ flexGrow: "1", minWidth: "200px", border: "1px solid #262626" }}>
                            <h4>Is Upto Date</h4>
                            <p>{isUpToDate ? 'True' : 'False'}</p>
                        </Tile>
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", flexWrap: "wrap" }}>
                    {myAccess !== 'Viewer' &&
                        <>
                            <Button kind="ghost" iconDescription="Share this device with others" renderIcon={Share} hasIconOnly={true} onClick={() => setIsAccessModalOpen(true)}></Button>
                            <Button kind="ghost" iconDescription='OTA updates' renderIcon={Upload} hasIconOnly={true} onClick={() => setIsOTAModalOpen(true)}></Button>
                        </>}
                    <Button kind="ghost" iconDescription='Configure device' renderIcon={SettingsEdit} hasIconOnly={true} as={Link} to={'./../configure'}></Button>
                    {myAccess !== 'Viewer' && <Button kind="ghost" iconDescription='Edit dashboard' renderIcon={Dashboard} hasIconOnly={true} as={Link} to={`/dashboard/${dashboardId}/edit`} target="_blank"></Button>}
                    <Button renderIcon={ArrowUpRight} as={Link} to={`/dashboard/${dashboardId}/view`} target="_blank">View Dashboard</Button>
                </div>
            </div>

            <Modal open={isAccessModalOpen}
                id='access-control-modal'
                onRequestClose={() => setIsAccessModalOpen(false)}
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
                    value={user?.name || user?.dummyName || ''}
                    onChange={(e) => {
                        console.log(e);

                        setUser(e.selectedItem)
                    }}
                    itemToElement={(item) =>
                        <div style={{ height: "60px", display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <img src={item.imageId ? `http://localhost:8080/profile/image/${item.imageId}` : bg} style={{ height: "50px", width: "50px", borderRadius: "50%", objectFit: "cover", marginRight: "15px" }} alt="profile pic" />
                            {item.name} <br />
                            {item.email}
                        </div>
                    }
                    titleText="Email"
                    onInputChange={(e) => {
                        setSearchPeople(e);
                        setUser(existing => ({ ...existing, dummyName: e }));
                    }}
                    className="custom-combobox"
                />

                <Dropdown
                    autoAlign
                    id="datastream-type-input"
                    label="Access"
                    titleText="Access"
                    selectedItem={accessControlLevel}
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

            <Modal open={isOTAModalOpen}
                id='ota-modal'
                onRequestClose={() => setIsOTAModalOpen(false)}
                onRequestSubmit={() => uploadOTAfile()}
                modalHeading="Update this device"
                primaryButtonText="Update"
                secondaryButtonText="Cancel"
                hasScrollingContent={false}
            >
                <TextInput
                    id="input-name"
                    type="text"
                    labelText="Version"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)} />
                {!otaFile ? <FileUploaderDropContainer
                    labelText="Upload your *.bin file here"
                    multiple={true}
                    accept={['.bin', '.hex']}
                    disabled={false}
                    name=""
                    onDragOver={(event) => event.preventDefault()}
                    onChange={(e) => console.log(e)}
                    onAddFiles={(e) => {
                        if (e.target.files && e.target.files.length > 0)
                            if (e.target.files[0].name.endsWith('.bin')) {
                                setOtaFile(e.target.files[0])
                            }
                    }
                    }
                    onClick={(e) => console.log(e)}
                    size="lg"
                    style={{ marginTop: "10px" }}
                /> : <FileUploaderItem iconDescription="Delete file" invalid={false} name={otaFile.name} status="edit" size="md" onDelete={() => setOtaFile(null)} />}
            </Modal>
        </div>
    );
}

export const deviceDetailsLoader = async (deviceId) => {
    const device = await axios.get(`/device/${deviceId}`)
        .then((res) => res.data)
        .then(async (device) => {
            if (!device.image) {
                return { ...device, image: esp }
            }
            const image = await axios.get(`/device/image/${device.image}`,
                { responseType: "blob" })
                .then((res) => {
                    return URL.createObjectURL(res.data)
                }).catch(() => {
                    return esp;
                });
            return { ...device, image };
        })
    const time = await axios.get(`/time`)
        .then((res) => res.data)

    return { device, time };
}

export default DeviceView;