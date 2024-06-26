import { lazy } from 'react';

import Loadable from '../components/Loadable';
import MainLayout from '../layout/MainLayout';

const Landing = Loadable(lazy(() => import('../pages/Landing/Landing')));
const Panel = Loadable(lazy(() => import('../pages/Panel/Panel')));
const Transfer = Loadable(lazy(() => import('../pages/Transfer/Transfer')));
const Wallet = Loadable(lazy(() => import('../pages/Wallet/Wallet')));
const Activity = Loadable(lazy(() => import('../pages/Activity/Activity')));
const Invoices = Loadable(lazy(() => import('../pages/Invoices/Invoices')));
const Notifications = Loadable(lazy(() => import('../pages/Notifications/Notifications')));
const Settings = Loadable(lazy(() => import('../pages/Settings/Settings')));
const Pay = Loadable(lazy(() => import('../pages/Payment/Pay')));

const MainRoutes = [
	{
		path: '/landing',
		element: <Landing />,
	},
	{
		path: '/',
		element: <MainLayout />,
		children: [
			{
				path: '/',
				element: <Panel />,
			},
			{
				path: '/panel',
				element: <Panel />,
			},
			{
				path: '/transfer',
				element: <Transfer />,
			},
			{
				path: '/wallet',
				element: <Wallet />,
			},
			{
				path: '/activity',
				element: <Activity />,
			},
			{
				path: '/invoices',
				element: <Invoices />,
			},
			{
				path: '/notifications',
				element: <Notifications />,
			},
			{
				path: '/settings',
				element: <Settings />,
			},
		],
	},
	{
		path: '/pay/:ecommerce/:price',
		element: <Pay />,
	},
	{
		path: '*',
		element: <h1>404 NOT FOUND</h1>,
	},
];

export default MainRoutes;
