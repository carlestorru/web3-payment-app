import { Outlet } from 'react-router-dom';

const MainLayout = () => {
	return (
		<main>
			<h2>LAYOOUT</h2>
			<Outlet />
		</main>
	);
};

export default MainLayout;
