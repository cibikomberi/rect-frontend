import { Slider } from "@carbon/react";
import sliderImg from "../../images/slider.png";

const SliderWidget = {
  element: (
    { id, min, max, label, step, args },
    plotData,
    height,
    width,
    sendMessage
  ) => {
    return (
      <Slider
        id={id}
        min={min}
        max={max}
        value={plotData}
        labelText={label}
        step={step}
        onChange={(e) => {
          sendMessage && sendMessage(id, e.value);
        }}
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
      {
        type: "int",
        label: "Step size",
        saveAs: "step",
      },
    ],
  },
  initial: {
    label: "",
    datastream: [],
    min: 0,
    max: 100,
    step: 1,
  },
};
 
export default SliderWidget;