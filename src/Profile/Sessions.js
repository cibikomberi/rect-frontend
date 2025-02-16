import axios from "axios";
import { useLoaderData } from "react-router-dom";
import VSCode from "../Icons/VsCode";

const Sessions = () => {
    const sessions = useLoaderData();

    return ( <>
        <h4>Your devices</h4>
        {sessions.map((session) => 
            <div>
                <div>
                    <VSCode />
                </div>
                <div>
                    <span>{`${session.client}`}</span>
                    <span>{`${session.os} - ${session.lastActiveTime}`}</span>                
                </div>
            </div>
        )}
    </> );
}

export const sessionsLoader = async () => {
    const sessions = await axios.get('user/sessions').then(res => res.data);

    return sessions;
}

export default Sessions;