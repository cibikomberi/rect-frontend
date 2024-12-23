import { NumberInput } from "@carbon/react";
import numInputImg from "../../images/num-input.svg";

const NumberInputWidget = {
  element: (
    { id, min, max, value, label, args },
    plotData,
    height,
    width,
    sendMessage
  ) => {
    return (
      <NumberInput
        id={id}
        min={min}
        max={max}
        value={plotData}
        label={label}
        onChange={(e, { value }) => {
          sendMessage && sendMessage(id, value);
        }}
        {...args}
      />
    );
  },
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