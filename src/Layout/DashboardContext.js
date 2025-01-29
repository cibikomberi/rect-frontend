import axios from "axios";
import React, { createContext, useState } from "react";

export const DashboardContext = createContext(1);

export const DashboardContextProvider = ({ children }) => {

      const [layout, setLayout] = useState([]);
      const [widgetData, setWidgetData] = useState({}); // Manages widget content mapped by `i` (id)

    const saveData = (days, dashboardId) => {
        console.log("save");
        console.log(widgetData);
        
        axios.put(`/dashboard/data/${dashboardId}`, {
            layout,
            widgetData,
            days
        });
    };
    return (
        <DashboardContext.Provider value={{ layout, setLayout, widgetData, setWidgetData, saveData }}>
            {children}
        </DashboardContext.Provider>
    );
};
