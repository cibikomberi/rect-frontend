import { GaugeChart } from "@carbon/charts-react";
import gaugeImg from "../../images/gauge.png";

const GaugeWidget = {
  element: ({ id, value, label }, height) => {
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
          width: "100%",
          gauge: {
            type: "semi",
          },
          theme: "g90",
        }}
      />
    );
  },
  image: gaugeImg,
  preDefinedSizes: {
    w: 12,
    h: 9,
    minW: 12,
    minH: 9,
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
    datastream: "",
    min: 0,
    max: 100,
  },
};
 
export default GaugeWidget;