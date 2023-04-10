import useAuth from '../../hooks/useAuth';
import useDocumentTitle from '../../hooks/useDocumentTitle';

function Notifications() {
	useAuth();
	useDocumentTitle('Notifications');

	return (
		<>
			<h2 className='text-2xl font-bold dark:text-white'>Notificaciones</h2>
			<h4 className='text-slate-500 dark:text-slate-200'>
				Visión general de los mercados y últimos pedidos
			</h4>
		</>
	);
}

export default Notifications;
