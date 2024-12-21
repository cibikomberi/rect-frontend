import areaImg from "../../images/area.svg";

const LabelWidget = {
  element: ({ id, value, label }) => {
    return (
      <div>
        <span class="cds--toggle__label-text" dir="auto">
          {label}
        </span>
        <h1 id={id}>{value}</h1>
      </div>
    );
  },
  image: areaImg,
  preDefinedSizes: {
    w: 5,
    h: 2,
    minW: 5,
    minH: 2,
  },
};

export default LabelWidget;
