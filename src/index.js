import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { getLibrary } from './config/web3';
import { Web3ReactProvider } from '@web3-react/core';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<Web3ReactProvider getLibrary={getLibrary}>
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</QueryClientProvider>
	</Web3ReactProvider>
);
