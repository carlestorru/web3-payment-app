import { useWeb3React } from '@web3-react/core';
import useAuth from '../../hooks/useAuth';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { Label, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';

function Settings() {
	const { account } = useWeb3React();
	useAuth();
	useDocumentTitle('Settings');
	const [username, setUsername] = useState('');
	const [isUsernameAvailable, setIsUsernameAvailable] = useState('');
	const [timer, setTimer] = useState(null);

	const fetchUsername = async (username) => {
		const response = await fetch(
			`http://localhost:3001/api/v1/accounts/${username}`
		);
		if (response.ok) {
			const data = await response.json();
			if (data.length > 0) {
				setUsername(data[0].username);
				setIsUsernameAvailable(false);
			}
			return data;
		}
		return null;
	};

	const inputChanged = (event) => {
		const inputUsername = event.target.value;
		setUsername(inputUsername);

		clearTimeout(timer);

		const newTimer = setTimeout(async () => {
			const result = await fetchUsername(inputUsername);
			const isAvailable = result.length === 0;
			if (isAvailable) {
				setIsUsernameAvailable(true);
				fetch(`http://localhost:3001/api/v1/accounts/${account}`, {
					method: 'PUT',
					body: JSON.stringify({ username: inputUsername }),
					headers: {
						'Content-Type': 'application/json',
					},
				});
			} else {
				setIsUsernameAvailable(false);
			}
		}, 1000);

		setTimer(newTimer);
	};

	useEffect(() => {
		setIsUsernameAvailable(true)
		fetchUsername(account);
	}, [account]);

	return (
		<>
			<h2 className='text-2xl font-bold'>Ajustes</h2>
			<h4 className='text-slate-500'>Configura tu usuario y preferencias</h4>
			<section className='mt-8 flex w-2/4 flex-col gap-4'>
				<div>
					<div className='mb-2 block'>
						<Label htmlFor='username' value='Introduce un nombre de usuario:' />
					</div>
					<TextInput
						id='userame'
						type='text'
						value={username}
						placeholder='Nombre de usuario...'
						onChange={inputChanged}
					/>
					{username.length > 0 ? (
						isUsernameAvailable ? (
							<small className='text-green-600'>Disponible</small>
						) : (
							<small className='text-red-600'>No disponible</small>
						)
					) : (
						''
					)}
				</div>
			</section>
		</>
	);
}

export default Settings;
