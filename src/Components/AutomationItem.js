import { Close, Save } from "@carbon/icons-react";
import { Button, ContainedList, ContainedListItem, Dropdown, TextInput, Tile, TimePicker } from "@carbon/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { isValidEmail } from "../Methods/Email";

const triggerEvents = [
    {
        name: "Trigger event at specified time",
        type: "schedule",
    },
    {
        name: "Notify other devices",
        type: "state",
    },
    {
        name: "Email datastream value",
        type: "email-value",
    },
    {
        name: "Email device status",
        type: "email-status",
    }
]

const AutomationItem = ({ editAutomation, setEditAutomation, setCreateAutomation, automationsList, setAutomationsList, datastreams }) => {

    const { device, deviceList } = useLoaderData();
    console.log(deviceList);

    const [automationType, setAutomationType] = useState(editAutomation.type || '');
    const [automationName, setAutomationName] = useState(editAutomation.name || '');
    const [automationValue, setAutomationValue] = useState(editAutomation.value || '');
    const [automationTime, setAutomationTime] = useState(editAutomation.time || '');
    const [otherDevice, setOtherDevice] = useState(editAutomation.targetDevice || {});
    const [otherDeviceDatastream, setOtherDeviceDatastream] = useState(editAutomation.targetDatastream || {});
    const [otherDeviceDatastreamList, setOtherDeviceDatastreamList] = useState([]);
    const [datastream, setDatastream] = useState(editAutomation.datastream || {});
    const [email, setEmail] = useState('');
    const [emailList, setEmailList] = useState(editAutomation.emailList || []);

    useEffect(() => {
        if (otherDevice.id) {
            axios.get(`/device/metadata/${otherDevice.id}`)
                .then(res => res.data)
                .then((device) => { setOtherDeviceDatastreamList(device.datastreams) })
        }
    }, [otherDevice]);
    const removeEmail = (id) => {
        setEmailList((existing) => {
            return existing.filter(item => item !== id)
        })
    }

    const addAutomation = () => {
        if (automationName === '' || automationType === '') {
            return;
        }
        if (automationsList.some(item => item.name === automationName)) return;
        const method = editAutomation ? 'put' : 'post';
        if (automationType === 'state') {
            axios.request({
                url: `device/automation/${device.id}`,
                method: method,
                data: {
                    type: automationType,
                    name: automationName,
                    datastream: datastream,
                    targetDevice: otherDevice,
                    targetDatastream: otherDeviceDatastream
                }
            }).then(res => {
                if (res.status === 200) {
                    setCreateAutomation(false);
                    setAutomationsList((existing) => {
                        existing = existing.filter(item => item.name !== automationName);
                        return ([{
                            type: automationType,
                            name: automationName,
                            datastream: datastream,
                            targetDevice: otherDevice,
                            targetDatastream: otherDeviceDatastream
                        }, ...existing])
                    })
                }
            })
        } else if (automationType === 'schedule') {
            axios.request({
                url: `device/automation/${device.id}`,
                method: method,
                data: {
                    type: automationType,
                    name: automationName,
                    datastream: datastream,
                    value: automationValue,
                    time: automationTime
                }
            }).then(res => {
                if (res.status === 200) {
                    setCreateAutomation(false);
                    setAutomationsList((existing) => {
                        existing = existing.filter(item => item.name !== automationName);
                        return ([{
                            type: automationType,
                            name: automationName,
                            datastream: datastream,
                            value: automationValue,
                            time: automationTime
                        }, ...existing])
                    })
                }
            })

        } else if (automationType === 'email-status') {
            axios.request({
                url: `device/automation/${device.id}`,
                method: method,
                data: {
                    type: automationType,
                    name: automationName,
                    emailList: emailList
                }
            }).then(res => {
                if (res.status === 200) {
                    setCreateAutomation(false);
                    setAutomationsList((existing) => {
                        existing = existing.filter(item => item.name !== automationName);
                        return ([{
                            type: automationType,
                            name: automationName,
                            emailList: emailList
                        }, ...existing])
                    })
                }
            })
        } else if (automationType === 'email-value') {
            axios.request({
                url: `device/automation/${device.id}`,
                method: method,
                data: {
                    type: automationType,
                    name: automationName,
                    datastream: datastream,
                    emailList: emailList
                }
            }).then(res => {
                if (res.status === 200) {
                    setCreateAutomation(false);
                    setAutomationsList((existing) => {
                        existing = existing.filter(item => item.name !== automationName);
                        return ([{
                            type: automationType,
                            name: automationName,
                            datastream: datastream,
                            emailList: emailList
                        }, ...existing])
                    })
                }
            })
        }
    }
    return (<Tile>
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: 'flex-end', gap: "1rem" }}>
            <TextInput
                id="automation-name"
                labelText="Name"
                value={automationName}
                disabled={editAutomation.name}
                onChange={(e) => setAutomationName(e.target.value)}
            />
            <Button kind="secondary" onClick={() => {
                setCreateAutomation(false)
                setEditAutomation({})
            }}
                iconDescription='Close'
                renderIcon={Close}
                hasIconOnly={true} />
        </div>
        <Dropdown
            autoAlign
            id="Automations-type-input"
            titleText="Trigger Event"
            selectedItem={triggerEvents.filter((item) => item.type === automationType)[0]}
            onChange={(e) => setAutomationType(e.selectedItem.type)}
            itemToString={(item) => item.name}
            items={triggerEvents}
            style={{
                marginBottom: '1rem'
            }} />

        {automationType === 'state' && <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            <Dropdown
                autoAlign
                id="Automations-datastream"
                label="Select Datastream"
                titleText="Select Datastream"
                selectedItem={datastream}
                onChange={(e) => setDatastream(e.selectedItem)}
                itemToString={(item) => item.name}
                items={datastreams}
                style={{ minWidth: "200px" }}
            />
            <Dropdown
                autoAlign
                id="Automations-device"
                label="Select Device"
                titleText="Select Device"
                selectedItem={otherDevice}
                onChange={(e) => setOtherDevice(e.selectedItem)}
                itemToString={(item) => item.name}
                items={deviceList.filter((item) => item.id !== device.id)}
                style={{ minWidth: "200px" }}
            />
            <Dropdown
                autoAlign
                id="Automations-target-datastream"
                label="Select Target Datastream"
                titleText="Select Target Datastream"
                selectedItem={otherDeviceDatastream}
                onChange={(e) => setOtherDeviceDatastream(e.selectedItem)}
                itemToString={(item) => item.name}
                disabled={!otherDevice.id}
                items={otherDevice.id ? otherDeviceDatastreamList : []}
                style={{ minWidth: "200px" }}
            />
            <Button onClick={addAutomation} renderIcon={Save} style={{ alignSelf: "flex-end" }}>
                Save
            </Button>
        </div>

        }

        {automationType === 'schedule' && <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            <Dropdown
                autoAlign
                id="Automations-state"
                label="Select Datastream"
                titleText="Select Datastream"
                selectedItem={datastream}
                onChange={(e) => setDatastream(e.selectedItem)}
                itemToString={(item) => item.name}
                items={datastreams}
            />

            <TextInput
                id="automation-value"
                labelText="Value"
                value={automationValue}
                onChange={(e) => setAutomationValue(e.target.value)}
            />
            <TimePicker
                autoAlign
                labelText="Select time"
                type="time"
                style={{ width: "100%" }}
                value={automationTime}
                onChange={(e) => setAutomationTime(e.target.value)}
            />
            <Button onClick={addAutomation} renderIcon={Save} style={{ alignSelf: "flex-end" }}>
                Save
            </Button>
        </div>}

        {automationType === 'email-status' && <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "1rem" }}>

                <TextInput
                    id="text-input-Email"
                    type="email"
                    labelText="Email"
                    placeholder="username@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    warn={email !== '' && !isValidEmail(email)}
                    warnText={'Please enter a valid email'}
                    onKeyDown={(e) => {
                        if (e.code === 'Enter') {
                            if (isValidEmail(email)) {
                                if (emailList.includes(email)) {
                                    return;
                                }
                                setEmail('')
                                setEmailList((existing) => {
                                    return ([...existing, email])
                                })
                            }
                        }
                    }}
                />
                <Button onClick={addAutomation} renderIcon={Save} style={{ alignSelf: "flex-end" }}>
                    Save
                </Button>
            </div>
            <ContainedList label="Added emails" kind="on-page" action={''}>
                {!emailList.length > 0 && <ContainedListItem style={{ display: "flex", justifyContent: 'center' }}>Please add some to proceed</ContainedListItem>}
                {emailList.map((item) => <ContainedListItem action={<Button kind="ghost" onClick={() => removeEmail(item)} iconDescription="Remove" hasIconOnly renderIcon={Close} aria-label="Dismiss" />}>{item}</ContainedListItem>)}
            </ContainedList>
        </div>}

        {automationType === 'email-value' && <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "1rem" }}>

                <TextInput
                    id="text-input-Email"
                    type="email"
                    labelText="Email"
                    placeholder="username@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    warn={email !== '' && !isValidEmail(email)}
                    warnText={'Please enter a valid email'}
                    onKeyDown={(e) => {
                        if (e.code === 'Enter') {
                            if (isValidEmail(email)) {
                                if (emailList.includes(email)) {
                                    return;
                                }
                                setEmail('')
                                setEmailList((existing) => {
                                    return ([...existing, email])
                                })
                            }
                        }
                    }}
                />
                <Dropdown
                    autoAlign
                    id="Automations-state"
                    label="Select Datastream"
                    titleText="Select Datastream"
                    selectedItem={datastream}
                    onChange={(e) => setDatastream(e.selectedItem)}
                    itemToString={(item) => item.name}
                    items={datastreams}
                />

                <Button onClick={addAutomation} renderIcon={Save} style={{ alignSelf: "flex-end" }}>
                    Save
                </Button>
            </div>
            <ContainedList label="Added emails" kind="on-page" action={''}>
                {!emailList.length > 0 && <ContainedListItem style={{ display: "flex", justifyContent: 'center' }}>Please add some to proceed</ContainedListItem>}
                {emailList.map((item) => <ContainedListItem action={<Button kind="ghost" onClick={() => removeEmail(item)} iconDescription="Remove" hasIconOnly renderIcon={Close} aria-label="Dismiss" />}>{item}</ContainedListItem>)}
            </ContainedList>
        </div>}
        <span className="cds--toggle__label-text" dir="auto" style={{marginBottom:'0'}}> *Automation values are not logged to database </span>
    </Tile>);
}

export default AutomationItem;