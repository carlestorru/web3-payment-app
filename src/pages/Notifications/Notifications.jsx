import useAuth from '../../hooks/useAuth';
import useDocumentTitle from '../../hooks/useDocumentTitle';

function Notifications() {
	useAuth();
	useDocumentTitle('Notifications');

	return <h2>Notifications</h2>;
}

export default Notifications;
