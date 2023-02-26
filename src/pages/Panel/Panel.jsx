import useAuth from '../../hooks/useAuth';
import useDocumentTitle from '../../hooks/useDocumentTitle';

function Panel() {
	useAuth();
	useDocumentTitle('Panel');

	return <h2>Panel</h2>;
}

export default Panel;
