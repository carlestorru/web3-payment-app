import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Ethereum from '../components/Icons/Ethereum';
import Menu from '../components/Icons/Menu';
import menuItems from '../menu-items';

const MainLayout = () => {
	const [showMenu, setShowMenu] = useState(true);
	const toggleMenu = () => {
		const sidebar = document.querySelector('.sidebar');
		sidebar.classList.toggle('-translate-x-full');
		setShowMenu(!showMenu);
	};

	return (
		<div className='relative min-h-screen md:flex'>
			{/* Mobile menu bar */}
			<div className='flex justify-between bg-gray-800 text-gray-100 md:hidden'>
				{/* Logo */}
				<span className='text-2xl font-extrabold'>Ethereum</span>

				<button
					className='p-4 focus:bg-gray-700 focus:outline-none'
					onClick={toggleMenu}>
					<Menu />
				</button>
			</div>

			{/* Sidebar */}
			<header
				className={
					'sidebar absolute inset-y-0 left-0 w-64 -translate-x-full transform space-y-6 bg-blue-800 py-7 px-2 text-blue-100 transition duration-200 ease-in-out md:relative md:translate-x-0'
				}>
				{/* Logo */}
				<Ethereum />
				{/* Nav */}
				<nav>
					{menuItems.map((item) => {
						return (
							<ul key={item.id} className='block py-2.5 px-2'>
								<h3 className='font-bold text-white'>{item.title}</h3>
								{item.children.map((child) => {
									return (
										<li
											key={child.id}
											className='duration block rounded py-2.5 px-4 transition hover:bg-blue-700'>
											<NavLink
												className={({ isActive }) => {
													return isActive ? 'font-semibold' : undefined;
												}}
												to={child.url}>
												{child.title}
											</NavLink>
										</li>
									);
								})}
							</ul>
						);
					})}
				</nav>
			</header>
			{/* Content */}
			<main className='flex-1 p-10 text-2xl font-bold'>
				<Outlet />
			</main>
		</div>
	);
};

export default MainLayout;
