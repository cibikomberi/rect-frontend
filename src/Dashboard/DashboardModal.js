import { Dropdown, FilterableMultiSelect, Modal, NumberInput, TextInput, Tile } from "@carbon/react";
import { WidgetsList } from "./WidgetsList";

const DashboardModal = ({
  open,
  setOpen,
  widgetData,
  activeWidget,
  setWidgetData,
  datastreams,
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
  return (
    <>
      {activeWidget && (
        <Modal
          open={open}
          passiveModal
          onRequestClose={() => setOpen(false)}
          modalHeading={`Edit ${
            widgetData[activeWidget] ? widgetData[activeWidget].type : ""
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
                  id="datastream-multiselect"
                  titleText="Select datastreams"
                  items={datastreams.filter(
                    (item) =>
                      item.type ===
                      WidgetsList[
                        widgetData[activeWidget].type
                      ].controls.type.split("-")[1]
                  )}
                  itemToString={(item) => item.name}
                  selectedItems={widgetData[activeWidget].datastream}
                  onChange={(e) => saveData("datastream", e.selectedItems)}
                  selectionFeedback="top-after-reopen"
                />
              ) : (
                <Dropdown
                  label="Select datastream"
                  titleText="Datastream"
                  id="datastream-Dropdown"
                  selectedItem={widgetData[activeWidget].datastream}
                  onChange={(e) => saveData("datastream", e.selectedItem)}
                  itemToString={(item) => item.name}
                  items={datastreams.filter(
                    (item) =>
                      item.type ===
                      WidgetsList[widgetData[activeWidget].type].controls.type
                  )}
                />
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
            <div style={{ display: "flex", alignItems: "center" }}>
              <Tile>
                {WidgetsList[widgetData[activeWidget].type].element({
                  ...widgetData[activeWidget],
                  args: { id: "modal-element" },
                })}
              </Tile>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default DashboardModal;
