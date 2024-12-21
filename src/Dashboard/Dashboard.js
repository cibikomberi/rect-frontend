import axios from "axios";
import ReactGridLayout from "react-grid-layout";
import { useLoaderData } from "react-router-dom";
import GridItem from "./GridItem";

const Dashboard = () => {
    const {dashboardConfig:{layout, widgetData}} = useLoaderData();
    const staticLayout = layout.map((item) => ({...item,static:true,  isDraggable: false}))
    console.log(staticLayout);
    
    return (
      <>
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
              />
            </div>
          ))}
        </ReactGridLayout>
      </>
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