import { useEffect, useCallback } from 'react';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import { connector } from '../config/web3';
import {
	NoEthereumProviderError,
	UserRejectedRequestError,
} from '@web3-react/injected-connector';

import { Wallet } from './WalletCard';
import { useLocation, useNavigate } from 'react-router-dom';

export function WalletConnector() {
	const { activate, active, deactivate, error } = useWeb3React();
	const navigate = useNavigate();
	const location = useLocation();

	const connect = useCallback(() => {
		activate(connector);
		localStorage.setItem('previouslyConnected', true);
		if (location.state?.from) navigate(location.state.from);
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

	const isNoEthereumProviderError = error instanceof NoEthereumProviderError;
	const isUserRejectedRequestError = error instanceof UserRejectedRequestError;
	const isUnsupportedChainIdError = error instanceof UnsupportedChainIdError;
	console.log(isNoEthereumProviderError);
	console.log(isUserRejectedRequestError);
	console.log(isUnsupportedChainIdError);

	return (
		<>
			{active ? (
				<>
					<button className='rounded-3xl bg-sky-800 px-4 py-2 text-white hover:bg-sky-700 sm:px-8 sm:py-3' onClick={disconnect}>Desconectar Wallet</button>
					<Wallet />
				</>
			) : (
				<button
					className='rounded-3xl bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3'
					onClick={connect}>
					Conectar wallet
				</button>
			)}
		</>
	);
}
