import { useEffect, useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import { connector } from '../config/web3';
import { useLocation, useNavigate } from 'react-router-dom';

export default function useAuth() {
	const { activate } = useWeb3React();
	const navigate = useNavigate();
	const location = useLocation();

	const connect = useCallback(() => {
		activate(connector);
	}, [activate]);

	useEffect(() => {
		if (localStorage.getItem('previouslyConnected') === 'true') {
			connect();
		} else {
			navigate('/landing', { replace: true, state: { from: location } });
		}
	}, [connect]);
}
