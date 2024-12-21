import { NumberInput } from "@carbon/react";
import numInputImg from "../../images/num-input.svg";

const NumberInputWidget = {
  element: ({ id, min, max, value, label, args }) => {
    return (
      <NumberInput
        id={id}
        min={min}
        max={max}
        value={value}
        label={label}
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
    type: "Integer",
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
    datastream: "",
    min: 0,
    max: 100,
  },
};
 
export default NumberInputWidget;