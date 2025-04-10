import ToggleWidget from "./Items/ToggleWidget";
import SliderWidget from "./Items/SliderWidget";
import NumberInputWidget from "./Items/NumberInputWidget";
import LabelWidget from "./Items/LabelWidget";
import GaugeWidget from "./Items/GaugeWidget";
import CircularGaugeWidget from "./Items/CircularGaugeWidget";
import AreaChartWidget from "./Items/AreaChartWidget";
import LineChartWidget from "./Items/LineChartWidget";
import LogWidget from "./Items/LogWidget";

export const WidgetsList = {
  Toggle: ToggleWidget,
  Slider: SliderWidget,
  NumberInput: NumberInputWidget,
  Label: LabelWidget,
  Gauge: GaugeWidget,
  CircularGauge: CircularGaugeWidget,
  AreaChart: AreaChartWidget,
  Log: LogWidget,
  LineChart: LineChartWidget
  // 'toggle':{
  //     element: <Toggle labelText="Label" labelA="Off" labelB="On" defaultToggled id="toggle-3" /> }
};
