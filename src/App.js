import { Theme } from '@carbon/react';
import './App.scss'
import MainLayout from './Layout/MainLayout';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import MyTemplates from './Templates/MyTemplates';
import TemplatesList, { templateListLoader } from './Templates/TemplatesList';
import DevicesList, { deviceListLoader } from './Devices/DevicesList';
import DeviceView, { deviceDetailsLoader } from './Devices/DeviceView';
import TemplateEdit, { fetchFlows } from './Templates/TemplateEdit';
import TemplateView, { templateDetailsLoader } from './Templates/TemplateView';
import TemplateConfigure, { templateMetadataLoader } from './Templates/Configure/TemplateConfigure';
import DeviceConfigure, { deviceMetadataLoader } from './Devices/DeviceConfigure';
import Editor, { dashboardEditorLoader } from './Dashboard/Editor';
import Dashboard from './Dashboard/Dashboard';

function App() {

	const routes = createBrowserRouter(
		createRoutesFromElements(
			<Route exact path='/' element={<MainLayout />}>
				<Route path='my-templates' element={<MyTemplates />} />
				<Route path='templates'>
					<Route index element={<TemplatesList />} loader={templateListLoader} />
					<Route path=':id/view' element={<TemplateView />} loader={(a) => templateDetailsLoader(a.params.id)} />
					<Route path=':id/configure' element={<TemplateConfigure />} loader={(a) => templateMetadataLoader(a.params.id)} />
					<Route path=':id/edit' element={<TemplateEdit />} loader={(a) => fetchFlows(a.params.id)} />
				</Route>

				<Route path='devices'>
					<Route index element={<DevicesList />} loader={deviceListLoader} />
					<Route path=':id/view' element={<DeviceView />} loader={(e) => deviceDetailsLoader(e.params.id)} />
					<Route path=':id/configure' element={<DeviceConfigure />} loader={(a) => deviceMetadataLoader(a.params.id)} />
					<Route path=':id/dashboard/edit' element={<Editor />} loader={(a) => dashboardEditorLoader(a.params.id)} />
					<Route path=':id/dashboard' element={<Dashboard />} loader={(a) => dashboardEditorLoader(a.params.id)} />
				</Route>

				<Route path='dashboard'>
					<Route index element={<Editor />} />
				</Route>
			</Route>
		)
	)


	return (
		<Theme theme="g90">
			<code dir="auto" className="text-mono">
				<RouterProvider router={routes} />
			</code>
		</Theme>
	);
}

export default App;
