import { Renew, Rocket } from "@carbon/icons-react";
import { Accordion, AccordionItem, Button, CodeSnippet, ProgressBar } from "@carbon/react";
import axios from "axios";
import { useEffect, useState } from "react";

const BuildStatus = ({ template, setTemplate }) => {
    const [buildErrors, setBuildErrors] = useState([]);
    const [status, setStatus] = useState({
        total: 0,
        success: 0,
        error: 0
    });

    const deploy = () => {
        axios.post(`/template/deploy/${template.id}`)
            .then((res) => {
                    setTemplate((existing) => ({ ...existing, productionVersion: template.buildVersion }))
                
            })
        }
        
    const rebuild = () => {
        axios.post(`/template/rebuild/${template.id}`)
            .then(() => updateDetails())
    }

    const updateDetails = () => {
        axios.get(`/template/build/status/${template.id}`)
            .then(res => res.data)
            .then((data) => {
                if (!data) return
                
                let s = {
                    total: 0,
                    success: 0,
                    error: 0,
                    start: 0
                };
                Object.keys(data.devices).forEach((key) => {
                    s.total++;
                    if (data.devices[key] === "Success") {
                        s.success++;
                    } else if (data.devices[key].startsWith('Error')) {
                        s.error++;
                    } else if (data.devices[key].startsWith('Started')) {
                        s.start++;
                    }
                })

                setStatus((existing) => {
                    if (s.error && existing.error !== s.error) {
                        axios.get(`/template/build/errors/${template.id}`)
                            .then((res) => res.data)
                            .then((data) => setBuildErrors(data))
                    }
                    return s
                })
            })
    }

    useEffect(() => {
        updateDetails();
        const id = setInterval(updateDetails, 5000)
        console.log(status);
        return () => clearInterval(id)
    }, [])

    return (<div style={{ paddingTop: "25px" }}>
        {/* <ToastNotification lowContrast /> */}
        <ProgressBar
            size="small"
            label="Build Progress"
            value={status.total && status.success ? ((status.success / status.total) * 100) : null}
            status={status.error ? ('error') : (status.total !== 0 && status.total === status.success ? 'finished' : 'active')}
            helperText={`${status.success}/${status.total}`}
            style={{ paddingTop: "10px" }}
        />
        <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
            <Button
                renderIcon={Renew}
                kind="ghost"
                onClick={rebuild}
                disabled={status.start !== 0}>
                Rebuild
            </Button>
            <Button
                renderIcon={Rocket}
                onClick={deploy}
                disabled={!(status.total !== 0 && status.total === status.success)}>
                Deploy to all devices
            </Button>
        </div>
        <Accordion>
            {buildErrors.map((item) =>
            (<AccordionItem title={item.deviceName} >
                {item.errorData && <CodeSnippet type="multi" feedback="Copied to clipboard">
                    {item.errorData}
                </CodeSnippet>}
            </AccordionItem>)
            )}
        </Accordion>
    </div>);
}

export default BuildStatus;