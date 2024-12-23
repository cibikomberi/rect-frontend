import { Toggle } from "@carbon/react";
import toggleImg from "../../images/toggle.png";

const ToggleWidget = {
  element: (
    { id, label, onLabel, offLabel, onVal, offVal, args },
    plotData,
    height,
    width,
    sendMessage
  ) => {
    console.log(onVal);
    console.log(plotData);
    console.log(plotData === onVal);
    
    return (
      <Toggle
        id={id}
        labelText={label}
        labelA={offLabel}
        labelB={onLabel}
        value={plotData}
        toggled={plotData === onVal}
        onToggle={(e) => {
          sendMessage && sendMessage(id, e ? onVal : offVal);
        }}
        // defaultToggled
        {...args}
      />
    );
  },
  image: toggleImg,
  preDefinedSizes: {
    w: 5,
    h: 2,
    minW: 5,
    minH: 2,
  },
  controls: {
    name: "Toggle",
    type: "Float",
    inputs: [
      {
        type: "int",
        label: "On Value",
        saveAs: "onVal",
      },
      {
        type: "int",
        label: "Off Value",
        saveAs: "offVal",
      },
      {
        type: "String",
        label: "On label",
        saveAs: "onLabel",
      },
      {
        type: "String",
        label: "Off label",
        saveAs: "offLabel",
      },
    ],
  },
  initial: {
    label: "",
    datastream: [],
    onVal: 1,
    offVal: 0,
    onLabel: "On",
    offLabel: "Off",
  },
};
 
export default ToggleWidget;