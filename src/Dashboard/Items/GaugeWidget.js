import { GaugeChart } from "@carbon/charts-react";
import gaugeImg from "../../Assets/gauge-widget.svg";

const GaugeWidgetElement = ({ id, min, max, label }, plotData, height, width) => {
  const value =
    (((plotData && plotData[plotData.length - 1])
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
        animations: true,
        title: label,
        resizable: true,
        height: { height },
        width: { width },
        gauge: {
          type: "semi",
        },
        theme: "g100",
      }}
    />
  );
}
const GaugeWidget = {
  element: GaugeWidgetElement,
  image: gaugeImg,
  preDefinedSizes: {
    w: 12,
    h: 6,
    minW: 12,
    minH: 6,
  },
  controls: {
    name: "Gauge",
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
 
export default GaugeWidget;