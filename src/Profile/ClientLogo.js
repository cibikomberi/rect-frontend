import { EdgeLogo } from "../Icons/Edge";
import { ChromeLogo } from "../Icons/Chrome";
import { SafariLogo } from "../Icons/Safari";
import { OperaLogo } from "../Icons/Opera";
import { BraveLogo } from "../Icons/Brave";
import { WindowsLogo } from "../Icons/Windows";
import { MacOSLogo } from "../Icons/MacOS";
import { AndroidLogo } from "../Icons/Android";

const ClientLogo = ({ client, os }) => {
    return (
        <>

            <div style={{
                position: 'relative',
                width: '60px',
                height: '60px',
            }}>
                <div>
                    {client.toLowerCase().includes("edge") && EdgeLogo}
                    {client.toLowerCase().includes("chrome") && ChromeLogo}
                    {client.toLowerCase().includes("safari") && SafariLogo}
                    {client.toLowerCase().includes("opera") && OperaLogo}
                    {client.toLowerCase().includes("brave") && BraveLogo}
                </div>
                <div style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    backgroundColor: 'white',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    transform: 'scale(0.65)',
                    transformOrigin: 'bottom right',
                    padding: '5px'
                }}>
                    {os.toLowerCase().includes("windows") && WindowsLogo} 
                    {os.toLowerCase().includes("android") && AndroidLogo} 
                    {os.toLowerCase().includes("mac") && MacOSLogo} 
                </div>
            </div>




        </>
    );
}

export default ClientLogo;