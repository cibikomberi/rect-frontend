import { SettingsEdit, Share, VersionMinor } from '@carbon/icons-react';
import { Button, ComboBox, Dropdown, Modal, Tile } from '@carbon/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import esp from '../Assets/esp32-wroom-32.jpg';
import bg from "./../Assets/bg.jpeg";

const accessControlItems = [{
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
}]

const TemplateView = () => {
    const { template: { id, name, description, image, productionVersion, devVersion, myAccess } } = useLoaderData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [people, setPeople] = useState([]);
    const [user, setUser] = useState([]);
    const [accessControlLevel, setAccessControlLevel] = useState(accessControlItems[0]);
    const [searchPeople, setSearchPeople] = useState('');


    const addNewAccesscontrol = () => {
        axios.post(`/template/userAccess/${id}`, {
            user: user.id,
            access: accessControlLevel.name
        }).then(res => {
            if (res.status === 200) {
                setIsModalOpen(false)
                setAccessControlLevel('')
            }
        })
    }


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

    return (
        <>
            <div style={{ display: 'flex', justifyContent: "space-between", height: "100%" }}>
                <div style={{ width: "48%", height: "100%" }}>
                    <h3 style={{ marginBottom: "15px" }}>Template details</h3>
                    <img src={image} style={{ maxWidth: '90%', maxHeight: "50%" }} alt="logo"></img>
                    <h2>{name}</h2>
                    <p>{description}</p>
                </div>

                <div style={{ width: "48%" }}>
                    <div>
                        <div style={{ display: "flex", flexWrap: "wrap", border: "1px solid #262626" }}>
                            <Tile id="tile-1" style={{ flexGrow: "1", minWidth: "200px", border: "1px solid #262626" }}>
                                <h4>Dev version</h4>
                                <p>{devVersion}</p>
                            </Tile>
                            <Tile id="tile-1" style={{ flexGrow: "1", minWidth: "200px", border: "1px solid #262626" }}>
                                <h4>Production version</h4>
                                <p>{productionVersion}</p>
                            </Tile>
                        </div>
                    </div>

                    {myAccess !== 'Viewer' &&
                        <div style={{ display: "flex", justifyContent: "flex-end", flexWrap: "wrap" }}>
                            <Button kind="ghost" iconDescription="Share this template" renderIcon={Share} hasIconOnly={true} onClick={() => setIsModalOpen(true)}></Button>
                            {/* <Button kind="ghost" iconDescription='Edit flows' renderIcon={FlowData} hasIconOnly={true}></Button> */}
                            <Button kind="ghost" iconDescription='Configure template' renderIcon={SettingsEdit} hasIconOnly={true} as={Link} to={'./../configure'} ></Button>
                            <Button renderIcon={VersionMinor} as={Link} to={'./../version-control'} >Version Control</Button>
                        </div>}
                        
                    {myAccess === 'Viewer' &&
                        <div style={{ display: "flex", justifyContent: "flex-end", flexWrap: "wrap" }}>
                            <Button renderIcon={SettingsEdit} as={Link} to={'./../configure'} >Configure template</Button>
                        </div>}
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
                    onInput={e => console.log(e)}
                    onChange={(e) => setAccessControlLevel(e.selectedItem)}
                    items={accessControlItems}
                    style={{
                        marginBottom: '1rem'
                    }} />
            </Modal>
        </>
    );
}

export const templateDetailsLoader = async (templateId) => {
    const template = await axios.get(`/template/${templateId}`)
        .then((res) => res.data)
        .then(async (template) => {
            if (!template.image) {
                return { ...template, image: esp }
            }
            const image = await axios.get(`/template/image/${template.image}`,
                { responseType: "blob" })
                .then((res) => {
                    return URL.createObjectURL(res.data)
                }).catch(() => {
                    return esp;
                });
            return { ...template, image };
        })
    return { template };
}

export default TemplateView;