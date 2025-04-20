import { Button, TextInput } from "@carbon/react";
import { useEffect, useRef, useState } from "react";
import gaugeImg from "../../Assets/log-widget.svg";
import { Send } from "@carbon/icons-react";

const LogWidgetElement = ({ id, min, max, label }, plotData, height, width, sendMessage) => {
    const logContainerRef = useRef(null);
    const [inputValue, setInputValue] = useState(""); // State to store the input value

    // Function to scroll to the bottom of the log
    const scrollToBottom = () => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    };

    // Use effect to scroll when component mounts or when plotData updates
    useEffect(() => {
        scrollToBottom();
    }, [plotData]);

    return (
        <>
            <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <span className="cds--toggle__label-text" style={{ margin: "0px" }} dir="auto">
                    {label}
                </span>
                <div
                    ref={logContainerRef}
                    style={{ overflow: "auto", scrollbarWidth: "thin", height: "100%" }}
                >
                    {plotData &&
                        plotData.map((data) => {
                            const date = new Date(data.time);
                            const day = String(date.getDate()).padStart(2, "0");
                            const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
                            const hours = String(date.getHours()).padStart(2, "0");
                            const minutes = String(date.getMinutes()).padStart(2, "0");
                            const seconds = String(date.getSeconds()).padStart(2, "0");
                            return (
                                <h5
                                    key={data.id}
                                    style={{
                                        color: data.type === "ERROR" ? "#FA4D56" : "",
                                    }}
                                >{`${day}-${month} ${hours}:${minutes}:${seconds} ${data.log}`}</h5>
                            );
                        })}
                </div>
                <div
                    style={{
                        display: "flex",
                    }}
                >
                    <TextInput
                        style={{ bottom: "0px", top: "auto" }}
                        id="log-input"
                        labelText="Datastream id"
                        hideLabel
                        size="md"
                        placeholder="Command your device"
                        value={inputValue} // Bind the input value to the state
                        onChange={(e) => setInputValue(e.target.value)} // Update state on input change
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                sendMessage && sendMessage(id, inputValue);
                                setInputValue(""); // Clear the input after sending
                            }
                        }}
                    />
                    <Button
                        kind="ghost"
                        iconDescription="Send"
                        renderIcon={Send}
                        hasIconOnly={true}
                        onClick={() => {
                            sendMessage && sendMessage(id, inputValue);
                            setInputValue(""); // Clear the input after sending
                        }}
                    />
                </div>
            </div>
        </>
    );
};

const LogWidget = {
    element: LogWidgetElement,
    image: gaugeImg,
    preDefinedSizes: {
        w: 12,
        h: 6,
        minW: 12,
        minH: 6,
    },
    controls: {
        name: "Log",
        type: "log",
        inputs: [],
    },
    initial: {
        label: "",
        datastream: [],
    },
};

export default LogWidget;