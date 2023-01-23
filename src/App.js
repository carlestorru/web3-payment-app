import './App.css';
import { useEffect, useCallback, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { connector } from './config/web3';

import { Wallet } from './components/Wallet';

function App() {
	const { activate, active, deactivate, error } = useWeb3React();

	const connect = useCallback(() => {
		activate(connector);
		localStorage.setItem('previouslyConnected', true);
	}, [activate]);

	useEffect(() => {
		if (localStorage.getItem('previouslyConnected') === 'true') {
			connect();
		}
	}, [connect]);

	const disconnect = () => {
		deactivate();
		localStorage.removeItem('previouslyConnected');
	};

	if (error) {
		console.error(error);
	}

	return (
		<main>
			{active ? (
				<>
					<button onClick={disconnect}>Desconectar Wallet</button>
					<Wallet />
				</>
			) : (
				<button onClick={connect}>Conectar wallet</button>
			)}
		</main>
	);
}

export default App;
