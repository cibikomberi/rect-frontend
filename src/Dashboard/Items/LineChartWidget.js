import { LineChart } from "@carbon/charts-react";
import lineImg from "../../Assets/line-chart-widget.svg";

const LineChartWidgetElement = ({ id, label, xLabel, yLabel }, plotData, height, width) => {
  return (
    <LineChart
      id={id}
      data={plotData ? plotData : []}
      options={{
        animations: false,
        title: label,
        axes: {
          bottom: {
            title: xLabel,
            mapsTo: "dateTime",
            scaleType: "time",
          },
          left: {
            mapsTo: "value",
            title: yLabel,
            scaleType: "linear",
          },
        },
        height: { height },
        theme: "g100",
        width: { width },
      }}
    />
  );
}
const LineChartWidget = {
  element: LineChartWidgetElement,
  image: lineImg,
  preDefinedSizes: {
    w: 12,
    h: 9,
    minW: 12,
    minH: 9,
  },
  controls: {
    name: "Line Chart",
    type: "list-Float",
    inputs: [
      {
        type: "String",
        label: "X - label",
        saveAs: "xLabel",
      },
      {
        type: "String",
        label: "Y - label",
        saveAs: "yLabel",
      },
    ],
  },
  initial: {
    label: "",
    datastream: [],
    xLabel: "X - Label",
    yLabel: "Y - Label",
  },
};
 
export default LineChartWidget;