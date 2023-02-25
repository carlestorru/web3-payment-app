import { useEffect, useCallback, useState } from 'react';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import { connector } from '../config/web3';
import {
	NoEthereumProviderError,
	UserRejectedRequestError,
} from '@web3-react/injected-connector';

import { Wallet } from './WalletCard';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiInformationCircle } from './Icons/HiInformationCircle';
import { Alert } from 'flowbite-react';

export function WalletConnector() {
	const { activate, active, deactivate, error } = useWeb3React();
	const [typeError, setTypeError] = useState('');
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

	useEffect(() => {
		const isNoEthereumProviderError = error instanceof NoEthereumProviderError;
		const isUserRejectedRequestError =
			error instanceof UserRejectedRequestError;
		const isUnsupportedChainIdError = error instanceof UnsupportedChainIdError;
		let typeErr = '';
		if (isNoEthereumProviderError) {
			typeErr = 'Please install Metamask extension:';
		} else if (isUserRejectedRequestError) {
			typeErr = 'User rejected request:';
		} else if (isUnsupportedChainIdError) {
			typeErr = 'Unsupported Chain connection:';
		}
		if (error) {
			setTypeError(typeErr);
		}
	}, [error]);

	return (
		<>
			{active ? (
				<>
					<button
						className='rounded-3xl bg-sky-800 px-4 py-2 text-white hover:bg-sky-700 sm:px-8 sm:py-3'
						onClick={disconnect}>
						Desconectar Wallet
					</button>
					<Wallet />
				</>
			) : (
				<button
					className='transform rounded-3xl bg-gradient-to-r from-sky-400 to-sky-600 px-4 py-2 text-white transition duration-300 hover:scale-105 hover:bg-gradient-to-l hover:from-sky-400 hover:to-sky-600 sm:px-8 sm:py-3'
					onClick={connect}>
					Conectar wallet
				</button>
			)}
			{error ? (
				<Alert
					className='absolute right-2 bottom-2'
					color='failure'
					icon={HiInformationCircle}>
					<span>
						<span className='font-medium'>{typeError}</span> {error.message}
					</span>
				</Alert>
			) : (
				''
			)}
		</>
	);
}
