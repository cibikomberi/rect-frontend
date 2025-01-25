import { Add, Save } from "@carbon/icons-react";
import { Button, Dropdown } from "@carbon/react";

const triggerEvents = [
    {
        name: "Schedule",
        type: "Schedule",
        inputs: [
            {
                type: "time",
                label: "Select a time to trigger an event"
            }
        ]
    },
    {
        name: "Device State",
        type: "state",
        inputs: [
            {
                type: "datastream",
                label: "Select a datastream which triggers the event"
            }
        ]
    }
]
const Automations = ({ deviceId }) => {
    return ( <>
        <Dropdown
            autoAlign
            id="Automations-type-input"
            label="Trigger Event"
            titleText="Trigger Event"
            // value={accessControlLevel}
            // onChange={(e) => setAccessControlLevel(e.selectedItem)}
            itemToString={(item) => item.name}
            items={triggerEvents}
            style={{
                marginBottom: '1rem'
            }} />

        <Button kind="ghost" iconDescription='New Event' renderIcon={Add} hasIconOnly={true}></Button>
        <Button renderIcon={Save}>Save</Button>

    </> );
}
 
export default Automations;