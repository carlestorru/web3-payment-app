const MainMenu = {
	id: 'main-menu',
	title: 'Menú Principal',
	type: 'Group',
	children: [
		{
			id: 'panel',
			title: 'Panel',
			type: 'item',
			url: '/panel',
			icon: '',
		},
        {
			id: 'transfer',
			title: 'Enviar y solicitar',
			type: 'item',
			url: '/transfer',
			icon: '',
		},
        {
			id: 'wallet',
			title: 'Wallet',
			type: 'item',
			url: '/wallet',
			icon: '',
		},
        {
			id: 'activity',
			title: 'Actividad',
			type: 'item',
			url: '/activity',
			icon: '',
		}
	],
};

export default MainMenu;
