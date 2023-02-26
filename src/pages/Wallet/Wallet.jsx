import useAuth from '../../hooks/useAuth';
import useDocumentTitle from '../../hooks/useDocumentTitle';

function Wallet() {
	useAuth();
	useDocumentTitle('Wallet');

	return <h2>Wallet</h2>;
}

export default Wallet;
