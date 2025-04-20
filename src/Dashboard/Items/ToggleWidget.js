import { Toggle } from "@carbon/react";
import toggleImg from "../../Assets/toggle-widget.svg";

const ToggleWidgetElement = (
  { id, label, onLabel, offLabel, onVal, offVal, args },
  plotData,
  height,
  width,
  sendMessage
) => {
  let timer;

  return (
    <Toggle
      id={id}
      labelText={label}
      labelA={offLabel}
      labelB={onLabel}
      value={plotData}
      toggled={
        parseInt(
          plotData && plotData[0] && plotData[plotData.length - 1].value
        ) === parseInt(onVal)
      }
      onToggle={(e) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          sendMessage && sendMessage(id, e ? onVal : offVal);
        }, 1000);
      }}
      // defaultToggled
      {...args}
    />
  );
}
const ToggleWidget = {
  element: ToggleWidgetElement,
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