import useAuth from '../../hooks/useAuth';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const Wallet = () => {
	useAuth();
	useDocumentTitle('Wallet');

	return <h2>Wallet</h2>;
};

export default Wallet;
