import Home from '../components/Icons/Home';
import Wallet from '../components/Icons/Wallet';
import CreditCard from '../components/Icons/CreditCard';
import ShoppingBag from '../components/Icons/ShoppingBag';

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
			icon: <Home />,
		},
		{
			id: 'transfer',
			title: 'Enviar y solicitar',
			type: 'item',
			url: '/transfer',
			icon: <CreditCard />,
		},
		{
			id: 'wallet',
			title: 'Wallet',
			type: 'item',
			url: '/wallet',
			icon: <Wallet />,
		},
		{
			id: 'activity',
			title: 'Actividad',
			type: 'item',
			url: '/activity',
			icon: <ShoppingBag />,
		},
	],
};

export default MainMenu;
