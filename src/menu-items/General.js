import { Bell } from '../components/Icons/Outlined/Bell';
import { Bell as BellSolid } from '../components/Icons/Solid/Bell';
import { Settings } from '../components/Icons/Outlined/Settings';
import { Settings as SettingsSolid } from '../components/Icons/Solid/Settings';
import { Logout } from '../components/Icons/Outlined/Logout';
import { Logout as LogoutSolid } from '../components/Icons/Solid/Logout';

const General = {
	id: 'general',
	title: 'General',
	type: 'Group',
	children: [
		{
			id: 'notifications',
			title: 'Notificaciones',
			type: 'item',
			url: '/notifications',
			icon: <Bell />,
			activeIcon: <BellSolid />,
		},
		{
			id: 'settings',
			title: 'Ajustes',
			type: 'item',
			url: '/settings',
			icon: <Settings />,
			activeIcon: <SettingsSolid />,
		},
		{
			id: 'logout',
			title: 'Salir',
			type: 'item',
			url: '/logout',
			icon: <Logout />,
			activeIcon: <LogoutSolid />,
		},
	],
};

export default General;
