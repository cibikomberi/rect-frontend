import axios from "axios";
import React, { createContext, useState } from "react";

export const DashboardContext = createContext(1);

export const DashboardContextProvider = ({ children }) => {

      const [layout, setLayout] = useState([]);
    const [resolution, setResolution] = useState('Desktop: 1024px');
      const [widgetData, setWidgetData] = useState({});

    const saveData = (days, dashboardId) => {
        console.log("save");
        console.log(widgetData);
        
        axios.put(`/dashboard/data/${dashboardId}?type=${resolution}`, {
            layout,
            widgetData,
            days
        });
    };
    return (
        <DashboardContext.Provider value={{ resolution, setResolution, layout, setLayout, widgetData, setWidgetData, saveData }}>
            {children}
        </DashboardContext.Provider>
    );
};
