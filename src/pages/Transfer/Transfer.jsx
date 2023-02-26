import useAuth from '../../hooks/useAuth';
import useDocumentTitle from '../../hooks/useDocumentTitle';

function Transfer() {
	useAuth();
	useDocumentTitle('Transfer');

	return <h2>Transfer</h2>;
}

export default Transfer;
