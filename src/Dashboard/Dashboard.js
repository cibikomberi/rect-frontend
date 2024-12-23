import axios from "axios";
import ReactGridLayout from "react-grid-layout";
import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useLoaderData } from "react-router-dom";
import GridItem from "./GridItem";

const Dashboard = () => {
    const {dashboardConfig:{layout, widgetData}, device} = useLoaderData();
    const [plot, setPlot] = useState({});
    const staticLayout = layout.map((item) => ({...item,static:true,  isDraggable: false}))
    console.log(layout);
    console.log(plot);

    const stompClientRef = useRef(null);
    useEffect(() => {
      const socket = new SockJS("http://localhost:8080/websocket");
      const stompClient = new Client({
        webSocketFactory: () => socket,
        onConnect: () => {
          console.log("Connected");
          layout.forEach((item) => {
            stompClient.subscribe(
              `/topic/data/${device.dashboardId}/${item.i}`,
              (message) => {
                console.log("Message: ", message.body);
                setPlot((existing) => ({...existing, [item.i]:message.body}))
              }
            );
          });

          layout.forEach((item) => {
            stompClient.publish({
              destination: `/app/dashboard/get/${device.dashboardId}/${item.i}`,
              body: "Hello, STOMP",
            });
          })
        },
        onStompError: (error) => console.error(error),
      });
      stompClient.activate();

      // Store the client in the ref

      stompClientRef.current = stompClient;
      // sendMessage();

      return () => {
        if (stompClientRef.current) {
          stompClientRef.current.deactivate();
        }
      };
    }, [device.dashboardId, layout]);

    const sendMessage = (widgetId, val) => {
      if (stompClientRef.current) {
        console.log(widgetId);
        console.log(val);
        
        stompClientRef.current.publish({
          destination: `/app/dashboard/post/${device.dashboardId}/${widgetId}`,
          body: val ? val : '0',
        });
      }
    };
    
    return (
      <div
        style={{
          // width: "calc(100% - 16rem)",
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
          style={{ height: "100%" }}
        >
          {layout.map((item) => (
            <div key={item.i}>
              <GridItem
                item={item}
                isEditable={false}
                content={widgetData[item.i]}
                plotData={plot[item.i]}
                sendMessage={sendMessage}
              />
            </div>
          ))}
        </ReactGridLayout>
      </div>
    );
}

export const dashboardLoader = async (deviceId) => {
    const {device, dashboardConfig} = await axios.get(`/device/${deviceId}`).then((res) => res.data)
          .then(async (device) => {
              const dashboardConfig = await axios.get(`/dashboard/${device.dashboardId}`)
                .then((res) => res.data);
              return {device, dashboardConfig}
            });
    
    return { device, dashboardConfig };
    
}
 
export default Dashboard;