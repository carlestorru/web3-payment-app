import { useEffect, useCallback, useState } from 'react';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import { connector } from '../config/web3';
import {
	NoEthereumProviderError,
	UserRejectedRequestError,
} from '@web3-react/injected-connector';

import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { HiInformationCircle } from './Icons/HiInformationCircle';
import MetamaskIcon from './Icons/MetamaskIcon';

import { Alert } from 'flowbite-react';

export function WalletConnector() {
	const { activate, active, error } = useWeb3React();
	const [typeError, setTypeError] = useState('');
	const [showAlert, setShowAlert] = useState(true);
	const navigate = useNavigate();
	const location = useLocation();

	const connect = useCallback(() => {
		activate(connector);
		localStorage.setItem('previouslyConnected', true);
		if (location.state?.from) navigate(location.state.from);
	}, [activate]);

	const onCloseAlert = () => {
		setShowAlert(false);
	};

	useEffect(() => {
		if (localStorage.getItem('previouslyConnected') === 'true') {
			connect();
		}
	}, [connect]);

	useEffect(() => {
		setShowAlert(true);
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
			localStorage.removeItem('previouslyConnected');
			setTypeError(typeErr);
		}
	}, [error]);

	return (
		<>
			{active ? (
				<Navigate to='/' />
			) : (
				<button
					type='button'
					onClick={connect}
					className='mr-2 mb-2 inline-flex items-center rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-center text-base font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100'>
					<MetamaskIcon />
					Conectar con MetaMask
				</button>
			)}
			{error && showAlert ? (
				<Alert
					onDismiss={onCloseAlert}
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
