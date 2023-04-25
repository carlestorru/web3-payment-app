import Menu from '../components/Icons/Menu';
import { useLayoutMode } from '../context/LayoutContext';
import Logo from '../assets/3pay_logo/4x/3pay_logo_gradient@4x.png';


export default function Header() {
    const [, toggleSideBar] = useLayoutMode()

	const toggleMenu = () => {
        toggleSideBar()
	};

	return (
		<header className='flex items-center justify-between bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-200 md:hidden'>
			{/* Logo */}
			<img className='h-9 w-16 ml-4' src={Logo} alt='3pay logo' />

			<button
				className='p-4 focus:bg-blue-300 dark:focus:bg-blue-500 focus:outline-none'
				onClick={toggleMenu}>
				<Menu />
			</button>
		</header>
	);
}
