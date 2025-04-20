import { GaugeChart } from "@carbon/charts-react";
import circularGaugeImg from "../../Assets/circular-gauge-widget.svg";

const CircularGaugeWidgetElement = ({ id, min, max, label }, plotData, height, width) => {
  const value =
    ((plotData && plotData[plotData.length - 1]
      ? plotData[plotData.length - 1].value
      : 0) *
      100) /
    (max - min);

  return (
    <GaugeChart
      id={id}
      data={[
        {
          group: "value",
          value: value,
        },
      ]}
      options={{
        title: label,
        resizable: true,
        height: { height },
        width: { width },
        gauge: {
          type: "full",
        },
        theme: "g100",
      }}
    />
  );
}
const CircularGaugeWidget = {
  element: CircularGaugeWidgetElement,
  image: circularGaugeImg,
  preDefinedSizes: {
    w: 12,
    h: 9,
    minW: 12,
    minH: 9,
  },
  controls: {
    name: "Circular Gauge",
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

export default CircularGaugeWidget;
