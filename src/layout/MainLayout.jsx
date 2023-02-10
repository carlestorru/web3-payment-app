import { useState, useRef } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Ethereum from '../components/Icons/Ethereum';
import Menu from '../components/Icons/Menu';
import menuItems from '../menu-items';

function MainLayout () {
	const [showMenu, setShowMenu] = useState(true);
	const sidebar = useRef();
	const toggleMenu = () => {
		sidebar.current.classList.toggle('-translate-x-full');
		setShowMenu(!showMenu);
	};

	return (
		<div className='relative min-h-screen md:flex'>
			{/* Mobile menu bar */}
			<header className='flex justify-between bg-gray-800 text-gray-100 md:hidden'>
				{/* Logo */}
				<span className='text-2xl font-extrabold'>Ethereum</span>

				<button
					className='p-4 focus:bg-gray-700 focus:outline-none'
					onClick={toggleMenu}>
					<Menu color='#FFF' />
				</button>
			</header>

			{/* Sidebar */}
			<div
				ref={sidebar}
				className={
					'absolute inset-y-0 left-0 w-64 -translate-x-full transform space-y-6 bg-blue-800 py-7 px-2 text-blue-100 transition duration-200 ease-in-out md:relative md:translate-x-0'
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
											className='rounded transition hover:bg-blue-700'>
											<NavLink
												className={({ isActive }) => {
													return isActive
														? 'list-item rounded bg-red-500 py-2.5 px-4 font-semibold'
														: 'list-item rounded py-2.5 px-4';
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
			</div>
			{/* Content */}
			<main className='flex-1 p-10 text-2xl font-bold'>
				<Outlet />
			</main>
		</div>
	);
};

export default MainLayout;
