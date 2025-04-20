import areaImg from "../../Assets/label-widget.svg";

const LabelWidgetElement = ({ id, label }, plotData) => {
  const value =

    ((plotData && plotData[plotData.length - 1])
      ? plotData[plotData.length - 1].value
      : 0)
  return (
    <div>
      <span className="cds--toggle__label-text" style={{ margin: "0px" }} dir="auto">
        {label}
      </span>
      <h1 id={id}>{value}</h1>
    </div>
  );
}
const LabelWidget = {
  element: LabelWidgetElement,
  image: areaImg,
  preDefinedSizes: {
    w: 5,
    h: 2,
    minW: 5,
    minH: 2,
  },
  controls: {
    name: "Label",
    type: "any",
    inputs: []
  },
  initial: {
    label: "",
    datastream: [],
  },
};

export default LabelWidget;
