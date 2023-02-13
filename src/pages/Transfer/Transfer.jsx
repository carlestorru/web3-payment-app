import useAuth from '../../hooks/useAuth';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const Transfer = () => {
	useAuth();
	useDocumentTitle('Transfer');

	return <h2>Transfer</h2>;
};

export default Transfer;
