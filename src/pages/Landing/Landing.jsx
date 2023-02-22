import { WalletConnector } from '../../components/WalletConnector';
import useDocumentTitle from '../../hooks/useDocumentTitle';

import styles from './Landing.module.css';

const Landing = () => {
	useDocumentTitle('Landing');

	return (
		<main
			className={`${styles.main} p-5 flex h-screen w-full flex-col items-center justify-center gap-12 text-center`}>
			<h1 className='text-7xl font-bold'>Web3 Payment App</h1>
			<h2 className='text-xl font-medium'>
				Paga tus compras en Ecommerce, envia dinero a tus contactos, emite
				facturas, consulta tu historial de transaciones y mucho más de forma{' '}
				<span className='text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-blue-900'>descentralizada</span>
			</h2>
			<WalletConnector />
		</main>
	);
};

export default Landing;
