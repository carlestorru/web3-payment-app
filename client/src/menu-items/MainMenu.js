import { Home } from '../components/Icons/Outlined/Home';
import { Home as HomeSolid } from '../components/Icons/Solid/Home';
import { Wallet } from '../components/Icons/Outlined/Wallet';
import { Wallet as WalletSolid } from '../components/Icons/Solid/Wallet';
import CreditCard from '../components/Icons/Outlined/CreditCard';
import { CreditCard as CreditCardSolid } from '../components/Icons/Solid/CreditCard';
import { ShoppingBag } from '../components/Icons/Outlined/ShoppingBag';
import { ShoppingBag as ShoppingBagSolid } from '../components/Icons/Solid/ShoppingBag';

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
			activeIcon: <HomeSolid />,
		},
		{
			id: 'transfer',
			title: 'Enviar y solicitar',
			type: 'item',
			url: '/transfer',
			icon: <CreditCard />,
			activeIcon: <CreditCardSolid />,
		},
		{
			id: 'wallet',
			title: 'Wallet',
			type: 'item',
			url: '/wallet',
			icon: <Wallet />,
			activeIcon: <WalletSolid />,
		},
		{
			id: 'activity',
			title: 'Actividad',
			type: 'item',
			url: '/activity',
			icon: <ShoppingBag />,
			activeIcon: <ShoppingBagSolid />,
		},
	],
};

export default MainMenu;
