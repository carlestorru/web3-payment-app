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
		<section
			className={`${
				isOpen ? '' : '-translate-x-full'
			} fixed inset-y-0 left-0 z-10 w-64 transform space-y-4 bg-white py-7 px-2 text-slate-600 transition duration-200 ease-in-out md:sticky md:translate-x-0 md:self-start`}>
			{/* Header */}
			<header>
				<Wallet />
			</header>
			{/* Nav */}
			<nav>
				{menuItems.map((item) => {
					return (
						<ul key={item.id} className='block py-2.5 px-2'>
							<li>
								<h4 className='mb-3 text-xs font-medium uppercase text-slate-600'>
									{item.title}
								</h4>
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
																<h5 className='text-black'>{child.title}</h5>
															</div>
														) : (
															<div className='flex flex-row items-center justify-start gap-4 py-2 px-1'>
																{child.icon}
																<h5>{child.title}</h5>
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
		</section>
	);
}
