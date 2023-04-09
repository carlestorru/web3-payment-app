import { Outlet } from 'react-router-dom';
import { LayoutModeProvider } from '../context/LayoutContext';
import Header from './Header';
import SideBar from './Sidebar';
import { SettingsProvider } from '../context/SettingsContext';

function MainLayout() {
	return (
		<LayoutModeProvider>
			<div className='relative min-h-screen md:flex'>
				{/* Mobile menu bar */}
				<Header />

				{/* Sidebar */}
				<SideBar />

				<SettingsProvider>
					{/* Content */}
					<main className='min-h-screen flex-1 overflow-auto bg-slate-100 p-10'>
						<Outlet />
					</main>
				</SettingsProvider>
			</div>
		</LayoutModeProvider>
	);
}

export default MainLayout;
