import { Client } from "@stomp/stompjs";
import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactGridLayout from "react-grid-layout";
import { useMediaQuery } from "react-responsive";
import { useParams } from "react-router-dom";
import SockJS from "sockjs-client";
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
  const isMobile = useMediaQuery({ query: '(min-width: 400px)' });
  const isTablet = useMediaQuery({ query: '(min-width: 800px)' });
  const isDesktop = useMediaQuery({ query: '(min-width: 1520px)' });
  const isLarge = useMediaQuery({ query: '(min-width: 2100px)' });

  const resolution = isLarge ? 'Large: 1440px' : isDesktop ? 'Desktop: 1024px' : isTablet ? 'Tablet: 768px' : isMobile ? 'Mobile: 600px' : 'Desktop: 1024px';
  console.log(resolution);

  const dashboardId = useParams().id;
  const [dashboardData, setDashboardData] = useState({ layout: [], widgetData: {}, days: 1 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/dashboard/data/${dashboardId}?type=${resolution}`);
        const data = response.data.dashboardData;
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, [dashboardId, resolution]);

  const { layout, widgetData, days } = dashboardData;
  const [plot, setPlot] = useState({});

  const staticLayout = layout.map((item) => ({
    ...item,
    static: true,
    isDraggable: false,
  }));

  const datastreams = filterData(
    Object.keys(widgetData).map((items) => widgetData[items].datastream)
  );

  const reconnectTimeout = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const stompClientRef = useRef(null);
  const isConnectedRef = useRef(false);

  useEffect(() => {
    datastreams.forEach((item) => {
      axios.get(`dashboard-data/${dashboardId}/${item.deviceId}/${item.identifier}/${days}`)
        .then((res) => res.data)
        .then((data) => {
          setPlot((existing) => ({
            ...existing,
            [`${item.deviceId}-${item.identifier}`]: data.data,
          }));
        });
    });
  }, [dashboardData]);

  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const currentTime = new Date().getTime();
      const cutoffTime = currentTime - days * 24 * 60 * 60 * 1000; // Calculate cutoff time
      console.log("ran");

      setPlot((existing) => {
        const updatedPlot = {};

        Object.keys(existing).forEach((key) => {
          const filteredData = existing[key].filter(
            (entry) => {
              return new Date(entry.dateTime).getTime() >= cutoffTime || new Date(entry.time).getTime() >= cutoffTime;
            }
          );
          updatedPlot[key] = filteredData;
        });

        return updatedPlot;
      });
    }, 600000); // Run cleanup every minute (adjust as needed)

    return () => {
      clearInterval(cleanupInterval); // Clear interval on component unmount
    };
  }, [days]);

  useEffect(() => {
    if (isConnectedRef.current) return;

    const connectWebSocket = () => {
      const socket = new SockJS(`http://localhost:8080/websocket?token=${localStorage.getItem("token")}&dashboard=${dashboardId}`);

      const stompClient = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        onConnect: () => {
          console.log("Connected");
          reconnectAttempts.current = 0; // Reset reconnection attempts
          isConnectedRef.current = true;

          datastreams.forEach((item) => {
            stompClient.subscribe(
              `/topic/data/${item.deviceId}/${item.identifier}`,
              (message) => {
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
                      ...(existing[`${item.deviceId}-${item.identifier}`] || []),
                      parsedMessage.data,
                    ],
                  }));
                }
              },
              {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                Dashboard: dashboardId,
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
        onStompError: (error) => console.error("STOMP error:", error),
        onWebSocketClose: () => {
          console.log("WebSocket disconnected");
          isConnectedRef.current = false;
          attemptReconnect();
        },
      });

      stompClient.activate();
      stompClientRef.current = stompClient;
    };

    const attemptReconnect = () => {
      if (reconnectAttempts.current < maxReconnectAttempts) {
        reconnectAttempts.current += 1;
        console.log(`Reconnection attempt ${reconnectAttempts.current}`);
        reconnectTimeout.current = setTimeout(() => {
          connectWebSocket();
        }, 5000); // Retry after 5 seconds
      } else {
        console.error("Max reconnection attempts reached");
      }
    };

    

    connectWebSocket();

    return () => {
      if (stompClientRef.current) {
        console.log("Disconnecting WebSocket");
        
        stompClientRef.current.deactivate();
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, [dashboardData]);

  const sendMessage = (widgetId, val) => {
    if (stompClientRef.current) {
      // Check if sending updates is allowed
      if (widgetData[widgetId] && widgetData[widgetId].datastream[0]) {
        stompClientRef.current.publish({
          destination: `/app/dashboard/post/${widgetData[widgetId].datastream[0].deviceId}/${widgetData[widgetId].datastream[0].identifier}`,
          body: val ? val : "0",
        });
      }
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
        cols={56}
        rowHeight={40}
        width={2000}
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

// export const dashboardLoader = async (dashboardId) => {
//   const dashboard = await axios
//     .get(`/dashboard/data/${dashboardId}`)
//     .then((res) => {
//       return res.data;
//     });

//   return { dashboardData: dashboard.dashboardData };
// };
export default Dashboard;
