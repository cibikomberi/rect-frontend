import { Wifi } from "@carbon/icons-react";
import { Tile } from "@carbon/react";
import axios from "axios";
import { useLoaderData } from "react-router-dom";
import AdgeistBanner from "../Components/AdgeistBanner";



function Home() {

    const data = useLoaderData();
    const { onlineDevices, totalDevices, upToDateDevices, templatesCount, dashboardsCount } = data;
    const isOnline = onlineDevices > 0;
    const isUpToDate = upToDateDevices > 0;

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100%",
                gap: "1rem"
            }}
        >
            {/* Top row: Device tiles */}
            <div style={{ display: "flex", gap: "1rem" }}>
                {/* Online Devices Tile */}
                <Tile style={{ width: "400px", textAlign: "center", padding: "3rem 2rem", position: "relative" }}>
                    {/* Blinking indicator */}
                    <div style={{
                        position: "absolute",
                        top: "1.5rem",
                        right: "1.5rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem"
                    }}>
                        <span
                            style={{
                                width: "16px",
                                height: "16px",
                                borderRadius: "50%",
                                background: isOnline ? "#24a148" : "#da1e28",
                                boxShadow: `0 0 12px 3px ${isOnline ? "#24a148" : "#da1e28"}`,
                                animation: "blink 2s infinite alternate"
                            }}
                        />
                        <span style={{ color: isOnline ? "#24a148" : "#da1e28", fontWeight: 500, fontSize: "1.25rem" }}>
                            {isOnline ? "Online" : "Offline"}
                        </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                        <span style={{ fontSize: "7rem", lineHeight: 1 }}>
                            {onlineDevices}
                        </span>
                        <span style={{ fontSize: "2rem", color: "#6f6f6f", marginLeft: "0.5rem", marginBottom: "0.5rem" }}>
                            / {totalDevices}
                        </span>
                    </div>
                    <p style={{ marginTop: "1rem", color: "#6f6f6f", fontSize: "1.5rem" }}>
                        Devices Online
                    </p>
                </Tile>

                {/* Up-to-date Devices Tile */}
                <Tile style={{ width: "400px", textAlign: "center", padding: "3rem 2rem", position: "relative" }}>
                    {/* Blinking indicator */}
                    <div style={{
                        position: "absolute",
                        top: "1.5rem",
                        right: "1.5rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem"
                    }}>
                        <span
                            style={{
                                width: "16px",
                                height: "16px",
                                borderRadius: "50%",
                                background: isUpToDate ? "#0f62fe" : "#da1e28",
                                boxShadow: `0 0 12px 3px ${isUpToDate ? "#0f62fe" : "#da1e28"}`,
                                animation: "blink 2s infinite alternate"
                            }}
                        />
                        <span style={{ color: isUpToDate ? "#0f62fe" : "#da1e28", fontWeight: 500, fontSize: "1.25rem" }}>
                            {isUpToDate ? "Updated" : "Outdated"}
                        </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                        <span style={{ fontSize: "7rem", lineHeight: 1 }}>
                            {upToDateDevices}
                        </span>
                        <span style={{ fontSize: "2rem", color: "#6f6f6f", marginLeft: "0.5rem", marginBottom: "0.5rem" }}>
                            / {totalDevices}
                        </span>
                    </div>
                    <p style={{ marginTop: "1rem", color: "#6f6f6f", fontSize: "1.5rem" }}>
                        Updated Devices
                    </p>
                </Tile>
            </div>

            {/* Bottom row: Templates and Dashboards */}
            <div style={{ display: "flex", gap: "1rem" }}>
                {/* Templates Tile */}
                <Tile style={{ width: "400px", textAlign: "center", padding: "2rem" }}>
                    <div style={{ fontSize: "5rem" }}>
                        {templatesCount}
                    </div>
                    <p style={{ marginTop: "1rem", color: "#6f6f6f", fontSize: "1.25rem" }}>
                        Templates
                    </p>
                </Tile>

                {/* Dashboards Tile */}
                <Tile style={{ width: "400px", textAlign: "center", padding: "2rem" }}>
                    <div style={{ fontSize: "5rem" }}>
                        {dashboardsCount}
                    </div>
                    <p style={{ marginTop: "1rem", color: "#6f6f6f", fontSize: "1.25rem" }}>
                        Dashboards
                    </p>
                </Tile>
            </div>

            {/* Floating Banner */}
            <div style={{
                position: "fixed",
                bottom: "0rem",
                right: "1rem",
                zIndex: 1000
            }}>
                <AdgeistBanner />
            </div>

            <style>
                {`
                @keyframes blink {
                    0% { opacity: 1; }
                    100% { opacity: 0.4; }
                }
                `}
            </style>
        </div>
    );
}
export const statsLoader = async () => {
    const deviceStats = await axios.get('devices/stats')
        .then(res => res.data)
    const templatesStats = await axios.get('templates/stats')
        .then(res => res.data)
    const dashboardsStats = await axios.get('dashboards/stats')
        .then(res => res.data)

    const stats = await Promise.all([deviceStats, templatesStats, dashboardsStats])
        .then(([devices, templates, dashboards]) => {
            return {
                onlineDevices: devices.onlineDevices,
                totalDevices: devices.totalDevices,
                upToDateDevices: devices.upToDateDevices,
                templatesCount: templates,
                dashboardsCount: dashboards
            };
        });    
    return stats
}
export default Home;