import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { getLibrary } from './config/web3';
import { Web3ReactProvider } from '@web3-react/core';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<Web3ReactProvider getLibrary={getLibrary}>
			<App />
		</Web3ReactProvider>
	</React.StrictMode>
);
