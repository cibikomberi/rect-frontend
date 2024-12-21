import { Toggle } from "@carbon/react";
import toggleImg from "../../images/toggle.png";

const ToggleWidget = {
  element: ({ id, label, onLabel, offLabel, args }) => {
    return (
      <Toggle
        id={id}
        labelText={label}
        labelA={offLabel}
        labelB={onLabel}
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
    type: "Integer",
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
    datastream: "",
    onVal: 1,
    offVal: 0,
    onLabel: "On",
    offLabel: "Off",
  },
};
 
export default ToggleWidget;