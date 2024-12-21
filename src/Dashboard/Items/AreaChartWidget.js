import { AreaChart } from "@carbon/charts-react";
import areaImg from "../../images/area.svg";

const AreaChartWidget = {
  element: (content, height) => {
    return (
      <AreaChart
        data={[
          {
            group: "Dataset 1",
            date: "2023-01-01",
            value: 0,
          },
          {
            group: "Dataset 1",
            date: "2023-01-06",
            value: 57312,
          },
          {
            group: "Dataset 1",
            date: "2023-01-08",
            value: 21432,
          },
          {
            group: "Dataset 1",
            date: "2023-01-15",
            value: 70323,
          },
          {
            group: "Dataset 1",
            date: "2023-01-19",
            value: 21300,
          },
          {
            group: "Dataset 2",
            date: "2023-01-01",
            value: 50000,
          },
          {
            group: "Dataset 2",
            date: "2023-01-05",
            value: 15000,
          },
          {
            group: "Dataset 2",
            date: "2023-01-08",
            value: 20000,
          },
          {
            group: "Dataset 2",
            date: "2023-01-13",
            value: 39213,
          },
          {
            group: "Dataset 2",
            date: "2023-01-19",
            value: 61213,
          },
          {
            group: "Dataset 3",
            date: "2023-01-02",
            value: 10,
          },
          {
            group: "Dataset 3",
            date: "2023-01-06",
            value: 37312,
          },
          {
            group: "Dataset 3",
            date: "2023-01-08",
            value: 51432,
          },
          {
            group: "Dataset 3",
            date: "2023-01-13",
            value: 40323,
          },
          {
            group: "Dataset 3",
            date: "2023-01-19",
            value: 31300,
          },
        ]}
        options={{
          title: "Time Series",
          axes: {
            bottom: {
              title: "2023 Annual Sales Figures",
              mapsTo: "date",
              scaleType: "time",
            },
            left: {
              mapsTo: "value",
              title: "Conversion rate",
              scaleType: "linear",
            },
          },
          height: { height },
        }}
      />
    );
  },
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
    datastream:[],
    xLabel: "X - Label",
    yLabel: "Y - Label",
  },
};
 
export default AreaChartWidget;