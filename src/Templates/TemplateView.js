import { Button, Tile } from '@carbon/react';
import esp from '../images/esp32-wroom-32.jpg'
import { ArrowUpRight, FlowData, Settings, Share } from '@carbon/icons-react';
import axios from 'axios';
import { Link, useLoaderData } from 'react-router-dom';
import { timeDifference } from '../Methods/Time';

const TemplateView = () => {
    const { template: { name, lastActiveTime, description, templateName }, time } = useLoaderData();


    return (
        <>
            <h3 style={{marginBottom:"15px"}}>Template details</h3>
            <div style={{ display: 'flex', justifyContent: "space-between", height: "100%" }}>
                <div style={{ width: "48%", height: "100%" }}>
                    <img src={esp} style={{ maxWidth: '90%', maxHeight: "50%" }} alt="logo"></img>
                    <h2>{name}</h2>
                    <p>{description}</p>
                </div>

                <div style={{ width: "48%" }}>
                    <div>
                        <div style={{ display: "flex", flexWrap: "wrap", border: "1px solid #262626" }}>
                            <Tile id="tile-1" style={{ flexGrow: "1", minWidth: "200px", border: "1px solid #262626" }}>
                                <h4>Status</h4>
                                <p>Online</p>
                            </Tile>
                            <Tile id="tile-1" style={{ flexGrow: "1", minWidth: "200px", border: "1px solid #262626" }}>
                                <h4>Last Active</h4>
                                <p>{timeDifference(time, lastActiveTime)}</p>
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

                    <div style={{ display: "flex", justifyContent: "flex-end", flexWrap: "wrap" }}>

                        <Button kind="ghost" iconDescription="Share this template" renderIcon={Share} hasIconOnly={true}></Button>
                        <Button kind="ghost" iconDescription='Edit flows' renderIcon={FlowData} hasIconOnly={true}></Button>
                        <Button as={Link} to={'./../configure'} kind="ghost" iconDescription='Configure template' renderIcon={Settings} hasIconOnly={true}></Button>
                        <Button renderIcon={ArrowUpRight} >Dashboard</Button>
                    </div>
                </div>
            </div>
        </>
    );
}

export const templateDetailsLoader = async (deviceId) => {
    const template = await axios.get(`/template/${deviceId}`)
        .then((res) => res.data)
    return { template };
}

export default TemplateView;