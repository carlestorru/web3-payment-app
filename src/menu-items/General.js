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
			icon: '',
		},
        {
			id: 'settings',
			title: 'Ajustes',
			type: 'item',
			url: '/settings',
			icon: '',
		},
        {
			id: 'logout',
			title: 'Salir',
			type: 'item',
			url: '',
			icon: '',
		}
	],
};

export default General;
