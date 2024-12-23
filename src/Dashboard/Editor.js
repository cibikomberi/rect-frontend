import { Tile } from "@carbon/react";
import React, { useEffect, useState } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { WidgetsList } from "./WidgetsList";
import { v4 as uuidv4 } from "uuid";
import GridItem from "./GridItem";
import DashboardModal from "./DashboardModal";
import axios from "axios";
import { useLoaderData, useParams } from "react-router-dom";

const Editor = () => {
  const { metadata, dashboardConfig } = useLoaderData();
  const { id: deviceId } = useParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeWidget, setActiveWidget] = useState("");
  const [layout, setLayout] = useState(dashboardConfig.layout);
  const [droppingItem, setDroppingItem] = useState();
  const [widgetData, setWidgetData] = useState(dashboardConfig.widgetData); // Manages widget content mapped by `i` (id)

  useEffect(() => {
    console.log(widgetData);
  }, [widgetData]);

  const onDragStart = (item) => {
    setDroppingItem(item);
    setWidgetData((prev) => ({
      ...prev,
      "dropping-element": item.content, // Store the widget content separately
    }));
  };
  const onEdit = (id) => {
    console.log("onEdit: ", id);
    setIsDialogOpen(true);
    setActiveWidget(id);
  };

  const layoutChange = (updatedLayout) => {
    console.log("Updated Layout:", updatedLayout);
    console.log("Updated Wid:", widgetData);
    setLayout(updatedLayout.filter((item) => item.i !== "dropping-element")); // No need to merge content; content is in `widgetData`
  };

  const onDrop = (layout, layoutItem) => {
    console.log("on Drop: ", layout, layoutItem);

    const newId = `widget-${uuidv4()}`;
    console.log(droppingItem);

    setLayout((prev) => [
      ...prev.filter((item) => item.i !== "dropping-element"),
      { ...layoutItem, i: newId },
    ]);

    setWidgetData((prev) => ({
      ...prev,
      [newId]: droppingItem.content,
    }));
  };
  const onRemoveItem = (id) => {
    console.log("on remove:", id);
    setLayout((items) => items.filter((item) => item.i !== id));
    setActiveWidget(null);
    setWidgetData((data) => {
      const newData = { ...data };
      delete newData[id];
      return newData;
    });
  };

  const saveData = () => {
    axios.post(`/dashboard/${deviceId}`, {
      layout,
      widgetData,
    });
  };

  return (
    <div style={{ width: "100%", height: "100%", display: "flex" }}>
      <div
        style={{
          width: "16rem",
          height: "100%",
          backgroundColor: "#161616",
          overflow: "auto",
          display:"flex",
          justifyContent: "center",
          flexWrap:"wrap",
          msOverflowStyle: "none" /* IE and Edge */,
          scrollbarWidth: "none",
        }}
      >
        <button onClick={saveData}>save</button>
        {Object.keys(WidgetsList).map((key) => {
          return (
            <Tile
              draggable={true}
              unselectable="on"
              onDragStart={() =>
                onDragStart({
                  i: "dropping-element",
                  ...WidgetsList[key].preDefinedSizes,
                  content: {
                    type: key,
                    ...WidgetsList[key].initial,
                  },
                })
              }
              style={{ width: "95%", overflow: "hidden", margin:"2px" }}
              key={key}
            >
              <div style={{ pointerEvents: "none" }}>
                <span className="cds--toggle__label-text" dir="auto">
                  {key}
                </span>
                <img
                  src={WidgetsList[key].image}
                  style={{ width: "-webkit-fill-available" }}
                  alt="a"
                />
              </div>
            </Tile>
          );
        })}
      </div>
      <div
        style={{
          width: "calc(100% - 16rem)",
          height: "100%",
          overflow: "auto",
          msOverflowStyle: "none" /* IE and Edge */,
          scrollbarWidth: "thin" /* Firefox */,
        }}
      >
        <GridLayout
          droppingItem={droppingItem}
          layout={layout}
          items={layout}
          onLayoutChange={layoutChange}
          onEdit={onEdit}
          onDrop={onDrop}
          onRemove={onRemoveItem}
          isDroppable={true}
          maxRows={"Infinity"}
          cols={56}
          rowHeight={40}
          width={2000}
          preventCollision={true}
          compactType={null}
          style={{ minHeight: "100%", minWidth: "100%", width: "fit-content" }}
          draggableCancel=".no-drag"
        >
          {layout.map((item) => (
            <div key={item.i}>
              <GridItem
                item={item}
                isEditable={true}
                onEdit={onEdit}
                onRemoveItem={onRemoveItem}
                content={widgetData[item.i]}
              />
            </div>
          ))}
        </GridLayout>
      </div>

      <DashboardModal
        open={isDialogOpen}
        setOpen={setIsDialogOpen}
        activeWidget={activeWidget}
        widgetData={widgetData}
        setWidgetData={setWidgetData}
        datastreams={metadata.datastreams}
      />
    </div>
  );
};

export const dashboardEditorLoader = async (deviceId) => {
  const { device, dashboardConfig } = await axios
    .get(`/device/${deviceId}`)
    .then((res) => res.data)
    .then(async (device) => {
      const dashboardConfig = await axios
        .get(`/dashboard/${device.dashboardId}`)
        .then((res) => res.data)
        .catch(() => ({ layout: [], widgetData: {} }));
      return { device, dashboardConfig };
    });
  const metadata = await axios
    .get(`/device/metadata/${deviceId}`)
    .then((res) => res.data);

  return { device, metadata, dashboardConfig };
};
export default Editor;
