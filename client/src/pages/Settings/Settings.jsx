import { useWeb3React } from '@web3-react/core';
import useAuth from '../../hooks/useAuth';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { Label, TextInput, ToggleSwitch } from 'flowbite-react';
import { useState } from 'react';
import getUsername from '../../services/getUsername';
import useUsername from '../../hooks/useUsername';
import { useSettings } from '../../context/SettingsContext';

function Settings() {
	const { account } = useWeb3React();
	const [settings, setSettings] = useSettings();
	const { username, setUsername, isUsernameAvailable, setIsUsernameAvailable } =
		useUsername();
	useAuth();
	useDocumentTitle('Settings');
	const [timer, setTimer] = useState(null);

	const inputChanged = (event) => {
		const inputUsername = event.target.value;
		setUsername(inputUsername);

		clearTimeout(timer);

		const newTimer = setTimeout(async () => {
			try {
				const result = await getUsername(inputUsername);
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
			} catch (err) {
				console.error(`API no disponible: ${err}`);
			}
		}, 1000);

		setTimer(newTimer);
	};

	const onToggle = () => {
		setSettings((prev) => {
			return { ...prev, readDB: !prev.readDB };
		});
	};

	return (
		<>
			<h2 className='text-2xl font-bold'>Ajustes</h2>
			<h4 className='text-slate-500'>Configura tu usuario y preferencias</h4>
			<section className='mt-8 flex flex-col gap-4 px-4'>
				<h3 className='text-xl font-bold'>Configuración de usuario</h3>
				<div className='px-6'>
					<div className='mb-2 block'>
						<Label htmlFor='username' value='Introduce un nombre de usuario:' />
					</div>
					<p className='my-2 text-xs text-gray-500'>
						Se distinguen entre mayúsculas y minúsculas.
					</p>
					<TextInput
						id='userame'
						type='text'
						value={username}
						placeholder='Nombre de usuario...'
						onChange={inputChanged}
						color={
							username.length > 0
								? isUsernameAvailable
									? 'success'
									: 'failure'
								: ''
						}
						helperText={
							username.length > 0 ? (
								isUsernameAvailable ? (
									<span className='font-medium'>Disponible</span>
								) : (
									<span className='font-medium'>No disponible</span>
								)
							) : (
								''
							)
						}
					/>
				</div>
			</section>
			<section className='mt-8 flex flex-col gap-4 px-4'>
				<h3 className='text-xl font-bold'>Configuración general</h3>
				<div className='px-6'>
					<div className='mb-2 block'>
						<Label htmlFor='toggleData' value='Fuente de datos' />
					</div>
					<ToggleSwitch
						id='toggleData'
						checked={settings.readDB}
						label={
							settings.readDB
								? 'Priorizar la obtención de datos desde la blockchain'
								: 'Priorizar la obtención de datos de una fuente centralizada'
						}
						onChange={onToggle}
					/>
				</div>
			</section>
		</>
	);
}

export default Settings;
