import Ethereum from '../components/Icons/Ethereum';
import menuItems from '../menu-items';
import { useLayoutMode } from '../context/LayoutContext';

import { NavLink, useLocation } from 'react-router-dom';

export default function SideBar() {
	const [isOpen] = useLayoutMode();

	const isLinkActive = (url) => {
		const location = useLocation();
		return location.pathname === url;
	};

	return (
		<div
			className={`${
				isOpen ? '' : '-translate-x-full'
			} absolute inset-y-0 left-0 w-64 transform space-y-6 bg-white py-7 px-2 text-gray-600 transition duration-200 ease-in-out md:relative md:translate-x-0`}>
			{/* Logo */}
			<Ethereum />
			{/* Nav */}
			<nav>
				{menuItems.map((item) => {
					return (
						<ul key={item.id} className='block py-2.5 px-2'>
							<li>
								<span className='font-bold uppercase'>{item.title}</span>
								<ul>
									{item.children.map((child) => {
										return (
											<li key={child.id} className='py-0.5'>
												<NavLink
													className={({ isActive }) => {
														return isActive
															? 'list-item rounded bg-blue-300 font-medium text-black'
															: 'list-item rounded transition hover:bg-blue-200';
													}}
													to={child.url}>
													{() =>
														isLinkActive(child.url) ? (
															<div className='flex flex-row items-center justify-start gap-4 py-2 px-1 text-blue-800'>
																{child.icon}
																{child.title}
															</div>
														) : (
															<div className='flex flex-row items-center justify-start gap-4 py-2 px-1'>
																{child.icon}
																{child.title}
															</div>
														)
													}
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
	);
}
