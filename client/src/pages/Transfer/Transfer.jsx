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
	Alert,
} from 'flowbite-react';
import { useWeb3React } from '@web3-react/core';
import { useState } from 'react';
import RequestMoneyContract from '../../contracts/RequestMoney.json';
import smartcontracts from '../../config/smartcontracts';
import getSymbolPrice from '../../services/getSymbolPrice';
import { HiInformationCircle } from '../../components/Icons/HiInformationCircle';
import { useBalance } from '../../context/BalanceContext';

function Transfer() {
	const { account, library: web3 } = useWeb3React();
	const [, updateUserBalance] = useBalance();
	const [txError, setTxError] = useState('');
	const [isSendingTx, setIsSendingTx] = useState(false);
	const [reqError, setReqError] = useState('');
	const [isRequestingTx, setIsRequestingTx] = useState(false);
	const [timer, setTimer] = useState(null);
	const [userResults, setUserResults] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);
	const [alertMsg, setAlertMsg] = useState('');
	const [showAlert, setShowAlert] = useState(false);
	useAuth();
	useDocumentTitle('Enviar y solicitar');

	const onCloseAlert = () => {
		setShowAlert(false);
	};

	/* This function handles the submision event for send money */
	const onSubmitSend = async (event) => {
		// Prevent the default form submission behavior
		event.preventDefault();
		// Set a state variable to indicate that a transaction is being sent
		setIsSendingTx(true);
		// Get the values of the form fields
		const fields = Object.fromEntries(new window.FormData(event.target));
		console.log(fields);
		// Get the nonce for the transaction
		const nonce = await web3.eth.getTransactionCount(account, 'latest');

		// Validate the quantity field is not 0
		if (fields.quantity === '0') {
			setTxError('La cantidad a enviar debe ser mayor de 0');
			setIsSendingTx(false);
			return;
		}

		// Validate the decimal separator in the quantity field
		if (fields.quantity.includes(',')) {
			setTxError('Los decimales deben separarse con . Ej: 10.99');
			setIsSendingTx(false);
			return;
		}

		// Convert the quantity to wei, based on the selected currency
		let value;
		if (fields.currency === '$') {
			const symConversion = await getSymbolPrice('USD', 'ETH');
			const dolarsToEth = fields.quantity * symConversion.ETH;
			value = web3.utils.toWei(dolarsToEth.toString());
		} else {
			value = web3.utils.toWei(fields.quantity);
		}

		// Create a transaction object
		const transaction = {
			from: account,
			to: fields.address,
			value: value,
			nonce: nonce,
			data: web3.utils.toHex(fields.message),
		};

		// Send the transaction to the blockchain
		const signedTx = await web3.eth.sendTransaction(
			transaction,
			function (error, hash) {
				if (!error) {
					console.log('The hash of your transaction is: ', hash);
					setAlertMsg(`Transacción realizada correctamente: ${hash}`);
					setShowAlert(true);
					setTimeout(() => {
						setShowAlert(false);
					}, 5000);
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

		// Get the details of the mined transaction
		const transactionMined = await web3.eth.getTransaction(
			signedTx.transactionHash
		);

		// Create a new object with the transaction details and the block information
		const insertedTx = {
			...transactionMined,
			blockHash: signedTx.blockHash,
			blockNumber: signedTx.blockNumber,
			transactionIndex: signedTx.transactionIndex,
		};

		// Post the transaction details to the API
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

		// Reset the state variable indicating that a transaction has been sent
		setIsSendingTx(false);
		// Update the user balance after the transaction is sent
		updateUserBalance(account, web3);
	};

	/* This function handles the submision event for request money */
	const onSubmitRequest = async (event) => {
		// Prevent the default form submission behavior
		event.preventDefault();
		// Set a state variable to indicate that a transaction is being requested
		setIsRequestingTx(true);
		// Get the values of the form fields
		const fields = Object.fromEntries(new window.FormData(event.target));
		console.log(fields);

		// Validate the quantity field is not 0
		if (fields.quantity === '0') {
			setReqError('La cantidad a enviar debe ser mayor de 0');
			setIsRequestingTx(false);
			return;
		}

		// Validate the decimal separator in the quantity field
		if (fields.quantity.includes(',')) {
			setReqError('Los decimales deben separarse con . Ej: 10.99');
			setIsRequestingTx(false);
			return;
		}

		// Create a new instance of the RequestMoney smart contract
		const contract = new web3.eth.Contract(
			RequestMoneyContract.abi,
			smartcontracts.RequestMoney
		);

		// Convert the quantity to wei, based on the selected currency
		let value;
		if (fields.currency === '$') {
			const symConversion = await getSymbolPrice('USD', 'ETH');
			const dolarsToEth = fields.quantity * symConversion.ETH;
			value = web3.utils.toWei(dolarsToEth.toString());
		} else {
			value = web3.utils.toWei(fields.quantity);
		}

		// Call the insertRequest method of the smart contract and send the transaction
		contract.methods
			.insertRequest(account, fields.address, value, fields.message)
			.send({ from: account, gasPrice: '1' }, function (error, hash) {
				// Handle the transaction receipt or error
				if (!error) {
					console.log('The hash of your transaction is: ', hash);
					setAlertMsg(`Transacción realizada correctamente: ${hash}`);
					setShowAlert(true);
					setTimeout(() => {
						setShowAlert(false);
					}, 5000);
				} else {
					console.log(
						'Something went wrong while submitting your transaction:',
						error
					);
					setReqError(error.message);
					setIsRequestingTx(false);
				}
			});

		// Reset the state variable indicating that a transaction has been requested
		setIsRequestingTx(false);
	};

	/* This function find account address due username */
	const findUsernames = (event) => {
		// Check if input field is not empty
		if (event.target.value.length !== 0) {
			// Clear previous timeout, if any
			clearTimeout(timer);
			// Set a new timeout to call API after 500ms of user inactivity
			const newTimer = setTimeout(async () => {
				try {
					// Call API to get user results
					const result = await getUsername(event.target.value);
					// Set user results state, or an empty array if no results are found
					setUserResults(result === null ? [] : result);
					// Reset selected user state
					setSelectedUser(null);
				} catch (err) {
					console.error(`API no disponible: ${err}`);
				}
			}, 500);

			// Set new timer
			setTimer(newTimer);
		} else {
			// If input field is empty, reset user results state
			setUserResults([]);
		}
	};

	const selectUser = (user, action) => {
		if (action === 'send') {
			document.getElementById('addressSend').value = user.hash;
		} else if (action === 'request') {
			document.getElementById('addressRequest').value = user.hash;
		}
		setSelectedUser(user);
	};

	return (
		<>
			<h2 className='text-2xl font-bold dark:text-white'>Enviar y solicitar</h2>
			<h4 className='text-slate-500 dark:text-slate-200'>
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
							onSubmit={onSubmitSend}>
							<div>
								<div className='mb-2 block'>
									<Label htmlFor='address' value='Wallet' />
								</div>
								<TextInput
									id='addressSend'
									name='address'
									shadow={true}
									placeholder='Introduce una dirección wallet...'
									required={true}
									onChange={findUsernames}
								/>
								{userResults.length > 0 && selectedUser === null ? (
									<div>
										<ul className='max-h-48 w-full overflow-y-auto rounded-b-lg border border-gray-100 bg-white p-1 dark:bg-gray-700'>
											{userResults.map((el) => {
												return (
													<li
														className='border-b-[1px] border-b-gray-600 p-1 text-sm text-black hover:cursor-pointer hover:bg-blue-300 hover:bg-opacity-40 dark:border-b-gray-300 dark:text-white hover:dark:bg-blue-600'
														key={el.username}
														onClick={() => selectUser(el, 'send')}>
														<p>
															Usuario:{' '}
															<span className='font-medium'>{el.username}</span>
														</p>
														<p className='text-xs text-gray-500 dark:text-gray-100'>
															{el.hash}
														</p>
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
											type='number'
											step='any'
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
					<Tabs.Item title='Solicitar'>
						<form
							className='flex flex-col content-center justify-center gap-4'
							onSubmit={onSubmitRequest}>
							<div>
								<div className='mb-2 block'>
									<Label htmlFor='address' value='Wallet' />
								</div>
								<TextInput
									id='addressRequest'
									name='address'
									shadow={true}
									placeholder='Introduce una dirección wallet...'
									required={true}
									onChange={findUsernames}
								/>
								{userResults.length > 0 && selectedUser === null ? (
									<div>
										<ul className='max-h-48 w-full overflow-y-auto rounded-b-lg border border-gray-100 bg-white p-1 dark:bg-gray-700'>
											{userResults.map((el) => {
												return (
													<li
														className='border-b-[1px] border-b-gray-600 p-1 text-sm text-black hover:cursor-pointer hover:bg-blue-300 hover:bg-opacity-40 dark:border-b-gray-300 dark:text-white hover:dark:bg-blue-600'
														key={el.username}
														onClick={() => selectUser(el, 'request')}>
														<p>
															Usuario:{' '}
															<span className='font-medium'>{el.username}</span>
														</p>
														<p className='text-xs text-gray-500 dark:text-gray-100'>
															{el.hash}
														</p>
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
							{isRequestingTx ? (
								<Button>
									<div className='mr-3'>
										<Spinner size='sm' light={true} />
									</div>
									Solicitando ...
								</Button>
							) : (
								<Button type='submit' fullSized={true}>
									Solicitar
								</Button>
							)}
						</form>
						{reqError ? (
							<div className='mt-4 text-sm text-red-500'>{reqError}</div>
						) : (
							''
						)}
					</Tabs.Item>
				</Tabs.Group>
			</section>
			{showAlert ? (
				<Alert
					onDismiss={onCloseAlert}
					className='fixed right-2 bottom-2 w-[50%] break-all'
					color='success'
					icon={HiInformationCircle}>
					<span>
						<span className='font-medium'>{alertMsg}</span>
					</span>
				</Alert>
			) : (
				''
			)}
		</>
	);
}

export default Transfer;
