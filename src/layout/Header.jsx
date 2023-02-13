import Menu from '../components/Icons/Menu';
import { useLayoutMode } from '../context/LayoutContext';

export default function Header() {
    const [, toggleSideBar] = useLayoutMode()

	const toggleMenu = () => {
        toggleSideBar()
	};

	return (
		<header className='flex items-center justify-between bg-white text-gray-600 md:hidden'>
			{/* Logo */}
			<span className='text-2xl font-extrabold'>Ethereum</span>

			<button
				className='p-4 focus:bg-blue-300 focus:outline-none'
				onClick={toggleMenu}>
				<Menu color='#4b5563' />
			</button>
		</header>
	);
}
