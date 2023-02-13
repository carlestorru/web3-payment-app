import Bell from '../components/Icons/Bell';
import Settings from '../components/Icons/Settings';
import Logout from '../components/Icons/Logout';

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
		},
        {
			id: 'settings',
			title: 'Ajustes',
			type: 'item',
			url: '/settings',
			icon: <Settings />,
		},
        {
			id: 'logout',
			title: 'Salir',
			type: 'item',
			url: '/logout',
			icon: <Logout />,
		}
	],
};

export default General;
