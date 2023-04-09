import { useState, useEffect } from 'react';
import getUsername from '../services/getUsername';
import { useWeb3React } from '@web3-react/core';

export default function useUsername() {
	const { account } = useWeb3React();
	const [username, setUsername] = useState('');
	const [isUsernameAvailable, setIsUsernameAvailable] = useState('');

	useEffect(() => {
		setIsUsernameAvailable(true);
		const fetchUsername = async (account) => {
			try {
				const result = await getUsername(account);
				if (result.length > 0) {
					setUsername(result[0].username);
					setIsUsernameAvailable(false);
				}
			} catch (err) {
				console.error(`API no disponible: ${err}`);
			}
		};

		fetchUsername(account);
	}, [account]);

	return { username, setUsername, isUsernameAvailable, setIsUsernameAvailable };
}
