import { WalletConnector } from '../../components/WalletConnector';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const Landing = () => {
	useDocumentTitle('Landing');

	return (
		<main className='flex h-screen flex-col items-center justify-center'>
			<h1>Landing page</h1>
			<WalletConnector />
		</main>
	);
};

export default Landing;
