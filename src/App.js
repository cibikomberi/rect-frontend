import { Theme } from '@carbon/react';
import './App.scss'
import MainLayout from './Layout/MainLayout';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import MyTemplates from './Templates/MyTemplates';
import TemplatesList from './Templates/TemplatesList';
import DevicesList from './Devices/DevicesList';
import DeviceView from './Devices/DeviceView';
import TemplateEdit from './Templates/TemplateEdit';

function App() {

	const routes = createBrowserRouter(
		createRoutesFromElements(
			<Route exact path='/' element={<MainLayout />}>
				<Route path='my-templates' element={<MyTemplates />} />
				<Route path='templates'>
					<Route index element={<TemplatesList />} />
					<Route path='edit/:id' element={<TemplateEdit />} />
				</Route>

				<Route path='devices'>
					<Route index element={<DevicesList />} />
					<Route path='view/:id' element={<DeviceView />} />
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
