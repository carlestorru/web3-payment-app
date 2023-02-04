import { lazy } from "react";

import Loadable from "../components/Loadable";

const Landing = Loadable(lazy(() => import('../pages/Landing/Landing')));
const Panel = Loadable(lazy(() => import('../pages/Panel/Panel')));
const Transfer = Loadable(lazy(() => import('../pages/Transfer/Transfer')));
const Wallet = Loadable(lazy(() => import('../pages/Wallet/Wallet')));
const Activity = Loadable(lazy(() => import('../pages/Activity/Activity')));

const MainRoutes = [
    {
        path: '/',
        element: <Landing />,
    },
    {
        path: '/panel',
        element: <Panel /> 
    },
    {
        path: '/transfer',
        element: <Transfer /> 
    },
    {
        path: '/wallet',
        element: <Wallet /> 
    },
    {
        path: '/activity',
        element: <Activity /> 
    },
]

export default MainRoutes;