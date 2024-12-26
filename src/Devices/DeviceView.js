import { Button, Tile } from '@carbon/react';
import esp from '../images/esp32-wroom-32.jpg'
import { ArrowUpRight, FlowData, SettingsEdit, Share, Upload } from '@carbon/icons-react';
import axios from 'axios';
import { Link, useLoaderData } from 'react-router-dom';
import { isLessThan30Seconds, timeDifference } from '../Methods/Time';
const DeviceView = () => {
    const {device:{ name, lastActiveTime, description, templateName, dashboardId }, time} = useLoaderData();
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

                    <Button kind="ghost" iconDescription="Share this device with others" renderIcon={Share} hasIconOnly={true}></Button>
                    <Button kind="ghost" iconDescription='OTA updates' renderIcon={Upload} hasIconOnly={true}></Button>
                    <Button kind="ghost" iconDescription='Edit flows' renderIcon={FlowData} hasIconOnly={true}></Button>
                    <Button as={Link} to={'./../configure'} kind="ghost" iconDescription='Configure device' renderIcon={SettingsEdit} hasIconOnly={true}></Button>
                    <Button renderIcon={ArrowUpRight} as={Link} to={`/dashboard/${dashboardId}/edit`} target="_blank">Edit Dashboard</Button> 
                </div>
            </div>
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