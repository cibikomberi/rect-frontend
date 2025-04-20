import "@carbon/charts/styles.css";
import { Theme } from "@carbon/react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./App.scss";
import Error from "./Components/Error";
import Dashboard from "./Dashboard/Dashboard";
import DashboardList, { dashboardListLoader } from "./Dashboard/DashboardList";
import Editor, { dashboardEditorLoader } from "./Dashboard/Editor";
import SharedDashboardList, { sharedDashboardsLoader } from "./Dashboard/SharedDashboardList";
import DeviceConfigure, { deviceMetadataLoader } from "./Devices/DeviceConfigure";
import DevicesList, { deviceListLoader } from "./Devices/DevicesList";
import DeviceView, { deviceDetailsLoader } from "./Devices/DeviceView";
import SharedDevicesList, { sharedDevicesLoader } from "./Devices/SharedDevicesList";
import { DashboardContextProvider } from "./Layout/DashboardContext";
import Login from "./Layout/Login";
import MainLayout from "./Layout/MainLayout";
import Register from "./Layout/Register";
import VSLogin from "./Layout/VSLogin";
import ProfileUpdate from "./Profile/ProfileUpdate";
import ProfileView, { myDetailsLoader } from "./Profile/ProfileView";
import Sessions, { sessionsLoader } from "./Profile/Sessions";
import TemplateConfigure, { templateMetadataLoader } from "./Templates/Configure/TemplateConfigure";
import SharedTemplatesList, { sharedTemplatesLoader } from "./Templates/SharedTemplatesList";
import TemplatesList, { templateListLoader } from "./Templates/TemplatesList";
import TemplateView, { templateDetailsLoader } from "./Templates/TemplateView";
import VersionControl, { templateVersionsLoader } from "./Templates/VersionControl";
import OauthSuccess from "./Layout/OauthSuccess";

function App() {
  const routes = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login-vs" element={<VSLogin />} />
        <Route path="/oauth/success" element={<OauthSuccess />} />
        <Route path="/" element={<MainLayout />} errorElement={<Error />}>

          <Route path="/home" />
          <Route path="profile">
            <Route index element={<ProfileView />} loader={myDetailsLoader} />
            <Route path="configure" element={<ProfileUpdate />} loader={myDetailsLoader} />
            <Route path="sessions" element={<Sessions />} loader={sessionsLoader} />
          </Route>

          <Route path="templates">
            <Route index element={<TemplatesList />} loader={templateListLoader} />
            <Route path=":id/view" element={<TemplateView />} loader={(a) => templateDetailsLoader(a.params.id)} />
            <Route path=":id/configure" element={<TemplateConfigure />} loader={(a) => templateMetadataLoader(a.params.id)} />
            <Route path=":id/version-control" element={<VersionControl />} loader={(a) => templateVersionsLoader(a.params.id)} />
          </Route>

          <Route path="devices">
            <Route index element={<DevicesList />} loader={deviceListLoader} />
            <Route path=":id/view" element={<DeviceView />} loader={(e) => deviceDetailsLoader(e.params.id)} />
            <Route path=":id/configure" element={<DeviceConfigure />} loader={(a) => deviceMetadataLoader(a.params.id)} />
            <Route path=":id/dashboard/edit" element={<Editor />} loader={(a) => dashboardEditorLoader(a.params.id)} />
            <Route path=":id/dashboard" element={<Dashboard />} loader={(a) => dashboardEditorLoader(a.params.id)} />
          </Route>

          <Route path="dashboard">
            <Route index element={<DashboardList />} loader={dashboardListLoader} />
            <Route path=":id/view" element={<Dashboard />} />
            <Route path=":id/edit" element={<Editor />} loader={(a) => dashboardEditorLoader(a.params.id)} />
          </Route>

          <Route path="shared">
            <Route path="dashboards" element={<SharedDashboardList />} loader={sharedDashboardsLoader} />
            <Route path="templates" element={<SharedTemplatesList />} loader={sharedTemplatesLoader} />
            <Route path="devices" element={<SharedDevicesList />} loader={sharedDevicesLoader} />
          </Route>

        </Route>

      </Route>
    )
  );
  console.log(process.env);

  return (
    <Theme theme="g90">
      <code dir="auto" className="text-mono">
        <DashboardContextProvider>
          <RouterProvider router={routes} />
        </DashboardContextProvider>
      </code>
    </Theme>
  );
}

export default App;
