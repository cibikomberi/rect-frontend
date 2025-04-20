import { AreaChart } from "@carbon/charts-react";
import areaImg from "../../Assets/area-chart-widget.svg";

const AreaChartWidgetElement = ({ id, label, xLabel, yLabel }, plotData, height, width) => {
  return (
    <AreaChart

      id={id}
      data={plotData ? plotData : []}
      options={{
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
const AreaChartWidget = {
  element: AreaChartWidgetElement,
  image: areaImg,
  preDefinedSizes: {
    w: 12,
    h: 9,
    minW: 12,
    minH: 9,
  },
  controls: {
    name: "Area Chart",
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
 
export default AreaChartWidget;