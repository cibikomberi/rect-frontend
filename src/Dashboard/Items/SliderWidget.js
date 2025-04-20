import { Slider } from "@carbon/react";
import sliderImg from "../../Assets/slider-widget.svg";

const SliderWidgetElement = (
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
      value={
        plotData && plotData[plotData.length - 1]
          ? parseInt(plotData[plotData.length - 1].value)
          : 0
      }
      labelText={label}
      step={step}
      onRelease={(e) => {
        sendMessage && sendMessage(id, e.value);
      }}
      onInputKeyUp={(e) => {
        if (e.key === "Enter") {
          sendMessage && sendMessage(id, e.target.value);
        }
      }}
      {...args}
      noValidate
    />
  );
}
const SliderWidget = {
  element: SliderWidgetElement,
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