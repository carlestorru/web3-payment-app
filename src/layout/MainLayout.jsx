import { useState, useRef } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Ethereum from '../components/Icons/Ethereum';
import Menu from '../components/Icons/Menu';
import menuItems from '../menu-items';

function MainLayout() {
	const [showMenu, setShowMenu] = useState(true);
	const sidebar = useRef();
	const toggleMenu = () => {
		sidebar.current.classList.toggle('-translate-x-full');
		setShowMenu(!showMenu);
	};

	return (
		<div className='relative min-h-screen md:flex'>
			{/* Mobile menu bar */}
			<header className='flex items-center justify-between bg-white text-gray-600 md:hidden'>
				{/* Logo */}
				<span className='text-2xl font-extrabold'>Ethereum</span>

				<button
					className='p-4 focus:bg-blue-300 focus:outline-none'
					onClick={toggleMenu}>
					<Menu color='#4b5563' />
				</button>
			</header>

			{/* Sidebar */}
			<div
				ref={sidebar}
				className={
					'absolute inset-y-0 left-0 w-64 -translate-x-full transform space-y-6 bg-white py-7 px-2 text-gray-600 transition duration-200 ease-in-out md:relative md:translate-x-0'
				}>
				{/* Logo */}
				<Ethereum />
				{/* Nav */}
				<nav>
					{menuItems.map((item) => {
						return (
							<ul key={item.id} className='block py-2.5 px-2'>
								<li>
									<span className='uppercase font-bold'>{item.title}</span>
									<ul>
										{item.children.map((child) => {
											return (
												<li key={child.id} className='py-0.5'>
													<NavLink
														className={({ isActive }) => {
															return isActive
																? 'list-item rounded bg-blue-300 font-semibold text-black'
																: 'list-item rounded transition hover:bg-blue-200';
														}}
														to={child.url}>
														<div className='flex flex-row items-center justify-start gap-4 py-2.5 px-1'>
															{child.icon}
															{child.title}
														</div>
													</NavLink>
												</li>
											);
										})}
									</ul>
								</li>
							</ul>
						);
					})}
				</nav>
			</div>
			{/* Content */}
			<main className='min-h-screen flex-1 bg-slate-100 p-10 text-2xl font-bold'>
				<Outlet />
			</main>
		</div>
	);
}

export default MainLayout;
