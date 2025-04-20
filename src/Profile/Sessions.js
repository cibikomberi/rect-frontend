import { Logout } from "@carbon/icons-react";
import { Button } from "@carbon/react";
import axios from "axios";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import ClientLogo from "./ClientLogo";

const Sessions = () => {
    const sessionData = useLoaderData();
    const [sessions, setSessions] = useState(sessionData);
    const removeSession = (id) => {
        axios.put('user/session-logout', { id })
        .then(res => res.data)
        .then(data => {
            if (data === "ok") {
                setSessions(existing => existing.filter(session => session.id !== id))
            }
        })
    }
    return ( <>
        <h4>Your devices</h4>
        {sessions.map((session) => 
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }} key={session.id}>
                <div>
                    <ClientLogo client={session.client} os={session.os}/>
                </div>
                <div style={{display: 'flex', flexDirection: "column", justifyContent:'center', paddingLeft: '5px'}}>
                    <span>{`${session.client}, ${session.os}`}</span>
                    <span style={{ fontWeight: '100', fontSize: '15px' }}>{`${session.location} - ${session.lastActiveTime?.split('T')[0]} ${session.lastActiveTime?.split('T')[1]?.split(':')[0]}:${session.lastActiveTime?.split('T')[1]?.split(':')[1]}`}</span>                
                </div>
                <Button
                    onClick={() => {removeSession(session.id)}}
                    kind="ghost"
                    renderIcon={Logout}
                    iconDescription="Logout"
                    hasIconOnly
                />
            </div>
        )}
        <span style={{fontSize: '12px'}}>*It may take upto 30mins to logout completely</span>
    </> );
}

export const sessionsLoader = async () => {
    const sessions = await axios.get('user/sessions').then(res => res.data);

    return sessions;
}

export default Sessions;