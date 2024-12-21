import { Slider } from "@carbon/react";
import sliderImg from "../../images/slider.png";

const SliderWidget = {
  element: ({ id, min, max, value, label, step, args }) => {
    return (
      <Slider
        id={id}
        min={min}
        max={max}
        value={value}
        labelText={label}
        step={step}
        {...args}
        noValidate
      />
    );
  },
  image: sliderImg,
  preDefinedSizes: {
    w: 12,
    h: 2,
    minW: 12,
    minH: 2,
  },
  controls: {
    name: "Slider",
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
      {
        type: "int",
        label: "Step size",
        saveAs: "step",
      },
    ],
  },
  initial: {
    label: "",
    datastream: "",
    min: 0,
    max: 100,
    step: 1,
  },
};
 
export default SliderWidget;