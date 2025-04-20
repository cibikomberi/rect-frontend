import {
  Dropdown,
  FilterableMultiSelect,
  Modal,
  NumberInput,
  TextInput,
  Tile,
} from "@carbon/react";
import { WidgetsList } from "./WidgetsList";
import React, { useEffect, useState } from "react";


const DashboardModal = ({
  open,
  setOpen,
  widgetData,
  activeWidget,
  setWidgetData,
  datastreams,
  devices
}) => {
  
  const saveData = (saveAs, val) => {
    setWidgetData((data) => ({
      ...data,
      [activeWidget]: {
        ...data[activeWidget],
        [saveAs]: val,
      },
    }));
  };
  const tile_ref = React.createRef();
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (tile_ref.current) {
      setHeight(tile_ref.current.getBoundingClientRect().height);
      setWidth(tile_ref.current.getBoundingClientRect().width);
    }
  }, [tile_ref]);

  return (
    <>
      {activeWidget && widgetData[activeWidget] && (
        <Modal
          open={open}
          passiveModal
          onRequestClose={() => setOpen(false)}
          modalHeading={`Edit ${widgetData[activeWidget] ? widgetData[activeWidget].type : ""
            }`}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              height: "100%",
            }}
          >
            <div>
              <TextInput
                id={"modal-label-inp"}
                labelText="Label"
                value={widgetData[activeWidget].label}
                onChange={(e) => {
                  saveData("label", e.target.value);
                }}
              />
              {WidgetsList[
                widgetData[activeWidget].type
              ].controls.type.includes("list") ? (
                <FilterableMultiSelect
                  autoAlign
                  id="datastream-multiselect"
                  titleText="Select datastreams"
                  items={datastreams.filter(
                    (item) =>
                      item.type ===
                      WidgetsList[
                        widgetData[activeWidget].type
                      ].controls.type.split("-")[1] || item.type === "any"
                  )}
                  itemToString={(item) => `[${item.deviceName}] ${item.name}`}
                  selectedItems={widgetData[activeWidget].datastream}
                  onChange={(e) => {
                    console.log(e);
                    
                    saveData("datastream", e.selectedItems)}}
                  selectionFeedback="top-after-reopen"
                />
              ) : (
                WidgetsList[
                  widgetData[activeWidget].type
                ].controls.type.includes("log") ?
                  (<FilterableMultiSelect
                    autoAlign
                    label="Select device"
                    titleText="Device"
                    id="device-Dropdown"
                    selectedItems={widgetData[activeWidget].datastream.map((datastream) => 
                      devices.find((device) => device.id === datastream.deviceId)
                    )}
                    onChange={(e) => {
                      saveData("datastream", e.selectedItems.map((device) => ({
                        deviceId: device.id,
                        deviceName: device.name,
                        identifier: "rect-log",
                      })))
                    }}
                    itemToString={(item) => item.name}
                    items={devices}
                  />) :
                  (<Dropdown
                    autoAlign
                    label="Select datastream"
                    titleText="Datastream"
                    id="datastream-Dropdown"
                    selectedItem={widgetData[activeWidget].datastream[0] ? widgetData[activeWidget].datastream[0] : ""}
                    onChange={(e) => saveData("datastream", [e.selectedItem])}
                    itemToString={(item) => `[${item.deviceName}] ${item.name}`}
                    items={datastreams.filter(
                      (item) =>
                        item.type === WidgetsList[widgetData[activeWidget].type].controls.type || WidgetsList[widgetData[activeWidget].type].controls.type === "any"
                    )}
                  />)
              )}

              {WidgetsList[widgetData[activeWidget].type].controls.inputs.map(
                (item) => {

                  if (item.type === "int") {
                    return (
                      <NumberInput
                        id={`${activeWidget}-input${item.label}`}
                        key={`${activeWidget}-input${item.label}`}
                        value={widgetData[activeWidget][item.saveAs]}
                        onChange={(_, { value }) =>
                          saveData(item.saveAs, value)
                        }
                        label={item.label}
                      />
                    );
                  } else if (item.type === "String") {
                    return (
                      <TextInput
                        id={`${activeWidget}-input${item.label}`}
                        key={`${activeWidget}-input${item.label}`}
                        labelText={item.label}
                        value={widgetData[activeWidget][item.saveAs]}
                        onChange={(e) => {
                          saveData(item.saveAs, e.target.value);
                        }}
                      />
                    );
                  }
                  return null;
                }
              )}
            </div>
            {(widgetData[activeWidget].type === "Toggle" ||
              widgetData[activeWidget].type === "Slider" ||
              widgetData[activeWidget].type === "Label" ||
              widgetData[activeWidget].type === "NumberInput"

            ) && 
            <div style={{ display: "flex", alignItems: "center" }}>
              <Tile ref={tile_ref} >
                {WidgetsList[widgetData[activeWidget].type].element({
                  ...widgetData[activeWidget],
                  args: { id: "modal-element" },
                }, height,
                  width,)}
              </Tile>
            </div>
}
          </div>
        </Modal>
      )}
    </>
  );
};

export default DashboardModal;
