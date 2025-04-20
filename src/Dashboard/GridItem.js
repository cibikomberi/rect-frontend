import { Button, Tile } from "@carbon/react";
import { WidgetsList } from "./WidgetsList";
import { Edit, TrashCan } from "@carbon/icons-react";
import React, { useEffect, useState } from "react";

const GridItem = ({
  item,
  onEdit,
  onRemoveItem,
  content,
  isEditable,
  plotData,
  sendMessage,
}) => {
  const tile_ref = React.createRef();
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  const mapData = plotData && content.datastream
    .map(
      (item) =>
        plotData[`${item.deviceId}-${item.identifier}`] &&
        plotData[`${item.deviceId}-${item.identifier}`].map(
          (val) => ({
            ...val,
            group: item.name,
          })
        )
    )
    .flat()
    .filter((item) => item);



  useEffect(() => {
    if (tile_ref.current) {
      setHeight(tile_ref.current.getBoundingClientRect().height);
      setWidth(tile_ref.current.getBoundingClientRect().width);
    }
  }, [tile_ref]);

  return (
    <Tile
      ref={tile_ref}
      style={{ position: "relative", height: "100%", width: "100%" }}
    >
      {/* {content && !data && (
        <img
          src={WidgetsList[content.type].image}
          alt=""
          style={{
            maxWidth: "-webkit-fill-available",
            maxHeight: "-webkit-fill-available",
          }}
        />
      )} */}
      {content &&
        WidgetsList[content.type].element(
          { ...content, id: item.i },
          (plotData && mapData[0]) ? mapData : [],
          height,
          width,
          sendMessage
        )}

      {/* Hover Actions */}
      {isEditable && (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            padding: "5px",
          }}
          className="hover-actions"
        >
          <Button
            className="no-drag"
            onClick={(e) => {
              onEdit(item.i);
            }}
            kind="ghost"
            iconDescription="Edit"
            renderIcon={Edit}
            hasIconOnly={true}
            size="sm"
          ></Button>
          <Button
            className="no-drag"
            onClick={(e) => {
              onRemoveItem(item.i);
            }}
            kind="ghost"
            renderIcon={TrashCan}
            iconDescription="Delete"
            hasIconOnly={true}
            size="sm"
          ></Button>
        </div>
      )}
    </Tile>
  );
};

export default GridItem;