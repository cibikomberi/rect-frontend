import { Theme } from '@carbon/react';
import './App.scss'
import MainLayout from './MainLayout';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import MyTemplates from './MyTemplates';
import TemplatesList from './TemplatesList';
import Templates from './Templates';

function App() {

	const routes = createBrowserRouter(
		createRoutesFromElements(
			<Route exact path='/' element={<MainLayout />}>
				<Route path='my-templates' element={<MyTemplates />} />
				<Route path='templates'>
					<Route index  element={<TemplatesList />} />
					<Route path='view'  element={<Templates />} />
					<Route path='edit'  element={<Templates />} />
				</Route>
			</Route>
		)
	)
	return (
			<Theme theme="g90">
				<RouterProvider router={routes} />
			</Theme>
	);
}

export default App;
