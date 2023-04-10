import Menu from '../components/Icons/Menu';
import { useLayoutMode } from '../context/LayoutContext';

export default function Header() {
    const [, toggleSideBar] = useLayoutMode()

	const toggleMenu = () => {
        toggleSideBar()
	};

	return (
		<header className='flex items-center justify-between bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-200 md:hidden'>
			{/* Logo */}
			<span className='ml-3 text-2xl font-extrabold'>ePay3</span>

			<button
				className='p-4 focus:bg-blue-300 dark:focus:bg-blue-500 focus:outline-none'
				onClick={toggleMenu}>
				<Menu />
			</button>
		</header>
	);
}
