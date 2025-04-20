import { NumberInput } from "@carbon/react";
import numInputImg from "../../Assets/number-input-widget.svg";

const NumberInputWidgetElement = (
  { id, min, max, value, label, args },
  plotData,
  height,
  width,
  sendMessage
) => {
  let timer;

  return (
    <NumberInput
      id={id}
      min={min}
      max={max}
      value={
        plotData && plotData[plotData.length - 1]
          ? plotData[plotData.length - 1].value
          : 0
      }
      label={label}
      onChange={(e, { value }) => {
        console.log(e);
        if (e.isTrusted) {
          clearTimeout(timer);
          timer = setTimeout(() => {
            sendMessage && sendMessage(id, value);
          }, 1000);
        }
      }}
      {...args}
    />
  );
}
const NumberInputWidget = {
  element: NumberInputWidgetElement,
  image: numInputImg,
  preDefinedSizes: {
    w: 6,
    h: 2,
    minW: 6,
    minH: 2,
  },
  controls: {
    name: "Number Input",
    type: "Float",
    inputs: [
      {
        type: "int",
        label: "Minimum",
        saveAs: "min",
      },
      {
        type: "int",
        label: "Maximum",
        saveAs: "max",
      },
    ],
  },
  initial: {
    label: "",
    datastream: [],
    min: 0,
    max: 100,
  },
};
 
export default NumberInputWidget;