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
	const { activate, active } = useWeb3React();
	const [typeError, setTypeError] = useState('');
	const [showAlert, setShowAlert] = useState(true);
	const navigate = useNavigate();
	const location = useLocation();

	const connect = useCallback(async () => {
		try {
			// Activate the chosen wallet connector
			await activate(connector, {}, true);
			// If the user successfully connects to the wallet, set a value of `true` for the `previouslyConnected` key in `localStorage`
			localStorage.setItem('previouslyConnected', true);
			// Navigate the user back to the original page if the user was redirected to the connection page from another page
			if (location.state?.from) navigate(location.state.from);
		} catch (err) {
			// If an error occurs during the connection process, set the `showAlert` state to `true` to display an error message to the user
			setShowAlert(true);
			// Determine the type of error that occurred and set the `typeErr` variable accordingly
			const isNoEthereumProviderError = err instanceof NoEthereumProviderError;
			const isUserRejectedRequestError =
				err instanceof UserRejectedRequestError;
			const isUnsupportedChainIdError = err instanceof UnsupportedChainIdError;
			let typeErr = '';
			if (isNoEthereumProviderError) {
				typeErr = 'Please install Metamask extension:';
			} else if (isUserRejectedRequestError) {
				typeErr = 'User rejected request:';
			} else if (isUnsupportedChainIdError) {
				typeErr = 'Unsupported Chain connection:';
			}
			// Set typeError
			setTypeError(typeErr + ' ' + err.message);
			console.log(typeErr + ' ' + err.message);
		}
	}, [activate]);

	const onCloseAlert = () => {
		setShowAlert(false);
	};

	useEffect(() => {
		if (localStorage.getItem('previouslyConnected') === 'true') {
			connect();
		}
	}, [connect]);

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
			{typeError && showAlert ? (
				<Alert
					onDismiss={onCloseAlert}
					className='absolute right-2 bottom-2'
					color='failure'
					icon={HiInformationCircle}>
					<span>
						<span className='font-medium'>{typeError}</span>
					</span>
				</Alert>
			) : (
				''
			)}
		</>
	);
}
