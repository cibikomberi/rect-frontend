import axios from "axios";
import ReactGridLayout from "react-grid-layout";
import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useLoaderData, useParams } from "react-router-dom";
import GridItem from "./GridItem";

function filterData(array) {
  const flattened = array.flat(); // Flatten the nested array
  const seen = new Set();

  return flattened.filter((item) => {
    const key = `${item.deviceId}|${item.identifier}`; // Unique key based on `deviceId` and `identifier`
    if (seen.has(key)) {
      return false; // Skip duplicates
    }
    seen.add(key);
    return true; // Keep unique items
  });
}

const Dashboard = () => {
  const dashboardId = useParams().id;
  const {
    dashboardData: { layout, widgetData },
  } = useLoaderData();
  const [plot, setPlot] = useState({});
  const staticLayout = layout.map((item) => ({
    ...item,
    static: true,
    isDraggable: false,
  }));
  const datastreams = filterData(
    Object.keys(widgetData).map((items) => widgetData[items].datastream)
  );
  

  const stompClientRef = useRef(null);
  useEffect(() => {
    const socket = new SockJS(`http://localhost:8080/websocket?token=${localStorage.getItem("token")}&dashboard=${dashboardId}`);
    
    const stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      onConnect: () => {
        console.log("Connected");
        datastreams.forEach((item) => {
          stompClient.subscribe(
            `/topic/data/${item.deviceId}/${item.identifier}`,
            (message) => {
              console.log("Message: ", message);
              const parsedMessage = JSON.parse(message.body);
              if (parsedMessage.type !== "update") {
                setPlot((existing) => ({
                  ...existing,
                  [`${item.deviceId}-${item.identifier}`]: parsedMessage.data,
                }));
              } else {
                setPlot((existing) => ({
                  ...existing,
                  [`${item.deviceId}-${item.identifier}`]: [
                    ...existing[`${item.deviceId}-${item.identifier}`],
                    parsedMessage.data,
                  ],
                }));
              }
            }, {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
              Dashboard: dashboardId
          }
          );
        });

        datastreams.forEach((item) => {
          stompClient.publish({
            destination: `/app/dashboard/get/${item.deviceId}/${item.identifier}`,
            body: "all",
          });
        });
      },
      onStompError: (error) => console.error(error),
    });
    stompClient.activate();

    stompClientRef.current = stompClient;

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, []);

  const sendMessage = (widgetId, val) => {
    if (stompClientRef.current) {
      // Check if sending updates is allowed
      console.log(widgetId);
      console.log(widgetData[widgetId]);

      stompClientRef.current.publish({
        destination: `/app/dashboard/post/${widgetData[widgetId].datastream[0].deviceId}/${widgetData[widgetId].datastream[0].identifier}`,
        body: val ? val : "0",
      });
    }
  };

  return (
    <div
      style={{
        height: "100%",
        overflow: "auto",
        msOverflowStyle: "none" /* IE and Edge */,
        scrollbarWidth: "thin" /* Firefox */,
      }}
    >
      <ReactGridLayout
        layout={staticLayout}
        items={staticLayout}
        isDroppable={false}
        isDraggable={false}
        isEditable={false}
        maxRows={13}
        cols={24}
        rowHeight={40}
        width={800}
        preventCollision={true}
        className="layout"
        isResizable={false}
        style={{ minHeight: "100%" }}
      >
        {layout.map((item) => (
          <div key={item.i}>
            <GridItem
              item={item}
              isEditable={false}
              content={widgetData[item.i]}
              plotData={plot}
              sendMessage={sendMessage}
            />
          </div>
        ))}
      </ReactGridLayout>
    </div>
  );
};

export const dashboardLoader = async (dashboardId) => {
  const dashboard = await axios
    .get(`/dashboard/data/${dashboardId}`)
    .then((res) => {
      return res.data;
    });

  return { dashboardData: dashboard.dashboardData };
};
export default Dashboard;
