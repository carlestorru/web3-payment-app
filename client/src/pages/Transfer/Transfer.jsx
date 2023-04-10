import useAuth from '../../hooks/useAuth';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import getUsername from '../../services/getUsername';
import {
	Label,
	TextInput,
	Button,
	Select,
	Tabs,
	Textarea,
	Spinner,
} from 'flowbite-react';
import { useWeb3React } from '@web3-react/core';
import { useState } from 'react';

function Transfer() {
	const { account, library: web3 } = useWeb3React();
	const [txError, setTxError] = useState('');
	const [isSendingTx, setIsSendingTx] = useState(false);
	const [timer, setTimer] = useState(null);
	const [userResults, setUserResults] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);
	useAuth();
	useDocumentTitle('Transfer');

	const onSubmit = async (event) => {
		event.preventDefault();
		setIsSendingTx(true);
		const fields = Object.fromEntries(new window.FormData(event.target));
		const nonce = await web3.eth.getTransactionCount(account, 'latest');

		console.log(fields);

		if (fields.quantity === '0') {
			setTxError('Quantity must be greater than zero');
			return;
		}

		const value = web3.utils.toWei(fields.quantity);

		const transaction = {
			from: account,
			to: fields.address,
			value: value,
			nonce: nonce,
			data: web3.utils.toHex(fields.message),
		};

		const signedTx = await web3.eth.sendTransaction(
			transaction,
			async function (error, hash) {
				if (!error) {
					console.log('The hash of your transaction is: ', hash);
				} else {
					console.log(
						'Something went wrong while submitting your transaction:',
						error
					);
					setTxError(error.message);
					setIsSendingTx(false);
				}
			}
		);

		const transactionMined = await web3.eth.getTransaction(
			signedTx.transactionHash
		);

		const insertedTx = {
			...transactionMined,
			blockHash: signedTx.blockHash,
			blockNumber: signedTx.blockNumber,
			transactionIndex: signedTx.transactionIndex,
		};

		fetch('http://localhost:3001/api/v1/transactions', {
			method: 'POST',
			body: JSON.stringify(insertedTx),
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((res) => res.json())
			.catch((err) => console.error(err))
			.then((response) => console.log(response));

		setIsSendingTx(false);
	};

	const findUsernames = (event) => {
		if (event.target.value.length !== 0) {
			clearTimeout(timer);

			const newTimer = setTimeout(async () => {
				try {
					const result = await getUsername(event.target.value);
					setUserResults(result === null ? [] : result);
					setSelectedUser(null);
				} catch (err) {
					console.error(`API no disponible: ${err}`);
				}
			}, 500);

			setTimer(newTimer);
		} else {
			setUserResults([]);
		}
	};

	const selectUser = (user) => {
		document.getElementById('address').value = user.hash;
		setSelectedUser(user);
	};

	return (
		<>
			<h2 className='text-2xl font-bold'>Enviar y solicitar</h2>
			<h4 className='text-slate-500'>
				Recibe y transfiere dinero a otras cuentas
			</h4>
			<section className='m-auto w-full pt-4 lg:w-3/5'>
				<Tabs.Group
					className='flex justify-center'
					aria-label='Tabs with underline'
					style='underline'>
					<Tabs.Item active={true} title='Enviar'>
						<form
							className='flex flex-col content-center justify-center gap-4'
							onSubmit={onSubmit}>
							<div>
								<div className='mb-2 block'>
									<Label htmlFor='address' value='Wallet' />
								</div>
								<TextInput
									id='address'
									name='address'
									shadow={true}
									placeholder='Introduce una dirección wallet...'
									required={true}
									onChange={findUsernames}
								/>
								{userResults.length > 0 && selectedUser === null ? (
									<div>
										<ul className='max-h-48 w-full overflow-y-auto rounded-b-lg border border-gray-100 bg-white p-1'>
											{userResults.map((el) => {
												return (
													<li
														className='border-b-[1px] border-b-gray-600 p-1 text-sm hover:cursor-pointer hover:bg-blue-300 hover:bg-opacity-40'
														key={el.username}
														onClick={() => selectUser(el)}>
														<p>
															Usuario:{' '}
															<span className='font-medium'>{el.username}</span>
														</p>
														<p className='text-xs text-gray-500'>{el.hash}</p>
													</li>
												);
											})}
										</ul>
									</div>
								) : (
									''
								)}
							</div>

							<div className='flex flex-row justify-between'>
								<div>
									<div className='mb-2 block'>
										<Label htmlFor='quantity' value='Cantidad' />
									</div>
									<div className='flex flex-row'>
										<TextInput
											id='quantity'
											name='quantity'
											placeholder='Cantidad...'
											required={true}
										/>
										<Select name='currency' id='currencies' required={true}>
											<option>ETH</option>
											<option>$</option>
										</Select>
									</div>
								</div>
							</div>

							<div>
								<div className='mb-2 block'>
									<Label htmlFor='message' value='¿Para que es este pago?' />
								</div>
								<Textarea
									id='message'
									name='message'
									placeholder='Escribe un mensaje...'
									rows={3}
								/>
							</div>
							{isSendingTx ? (
								<Button>
									<div className='mr-3'>
										<Spinner size='sm' light={true} />
									</div>
									Enviando ...
								</Button>
							) : (
								<Button type='submit' fullSized={true}>
									Enviar
								</Button>
							)}
						</form>
						{txError ? (
							<div className='mt-4 text-sm text-red-500'>{txError}</div>
						) : (
							''
						)}
					</Tabs.Item>
					<Tabs.Item title='Solicitar'>Solicitar</Tabs.Item>
				</Tabs.Group>
			</section>
		</>
	);
}

export default Transfer;
