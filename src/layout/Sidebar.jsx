import { Wallet } from '../components//WalletCard';
import menuItems from '../menu-items';
import { useWeb3React } from '@web3-react/core';
import { useLayoutMode } from '../context/LayoutContext';

import { NavLink, useLocation, useNavigate } from 'react-router-dom';

export default function SideBar() {
	const { deactivate } = useWeb3React();
	const navigate = useNavigate();

	const [isOpen] = useLayoutMode();

	const isLinkActive = (url) => {
		const location = useLocation();
		return location.pathname === url;
	};

	const disconnect = () => {
		deactivate();
		localStorage.removeItem('previouslyConnected');
		navigate('/landing');
	};

	return (
		<div
			className={`${
				isOpen ? '' : '-translate-x-full'
			} absolute inset-y-0 left-0 w-64 transform space-y-4 bg-white py-7 px-2 text-slate-600 transition duration-200 ease-in-out md:relative md:translate-x-0`}>
			{/* Logo */}
			<Wallet />
			{/* Nav */}
			<nav>
				{menuItems.map((item) => {
					return (
						<ul key={item.id} className='block py-2.5 px-2'>
							<li>
								<span className='font-bold uppercase'>{item.title}</span>
								<ul>
									{item.children.map((child) => {
										if (child.id === 'logout') {
											return (
												<li
													key={child.id}
													className='list-item rounded py-0.5 transition hover:bg-blue-200'>
													<button
														onClick={disconnect}
														className='w-full active:bg-blue-300 active:font-medium'>
														<div className='flex flex-row items-center justify-start gap-4 py-2 px-1'>
															{child.icon}
															{child.title}
														</div>
													</button>
												</li>
											);
										}
										return (
											<li key={child.id} className='py-0.5'>
												<NavLink
													className={({ isActive }) => {
														return isActive
															? 'list-item rounded bg-blue-300 bg-opacity-40 font-medium text-black'
															: 'list-item rounded transition hover:bg-blue-200 hover:font-medium';
													}}
													to={child.url}>
													{() =>
														isLinkActive(child.url) ? (
															<div className='flex flex-row items-center justify-start gap-4 py-2 px-1 text-blue-500'>
																{child.activeIcon}
																<h3 className='text-black'>{child.title}</h3>
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
