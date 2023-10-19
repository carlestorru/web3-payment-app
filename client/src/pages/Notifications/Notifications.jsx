import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import RequestMoneyContract from '../../contracts/RequestMoney.json';
import { useWeb3React } from '@web3-react/core';
import { Card, Button, Modal, Spinner, Alert } from 'flowbite-react';
import { CheckIcon } from '../../components/Icons/Check';
import { Xmark } from '../../components/Icons/Xmark';
import smartcontracts from '../../config/smartcontracts';
import getSymbolPrice from '../../services/getSymbolPrice';
import InvoiceContract from '../../contracts/Invoice.json';
import InvoicesContract from '../../contracts/Invoices.json';
import { HiInformationCircle } from '../../components/Icons/HiInformationCircle';
import { useBalance } from '../../context/BalanceContext';

function Notifications() {
	useAuth();
	useDocumentTitle('Notifications');
	const { account, library: web3 } = useWeb3React();
	const [, updateUserBalance] = useBalance();
	const [requests, setRequests] = useState([]);
	const [invoices, setInvoices] = useState([]);
	const [loadingRequests, setLoadingRequests] = useState(true);
	const [loadingInvoices, setLoadingInvoices] = useState(true);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [detailedInvoice, setDetailedInvoice] = useState(null);
	const [alertMsg, setAlertMsg] = useState('');
	const [showAlert, setShowAlert] = useState(false);
	const [alertType, setAlertType] = useState('info');

	/* This function handle user request money confirmation */
	const onAcceptRequest = async ({ address, amount, concept }, index) => {
		console.log({ address, amount, concept, index });
		// Get the nonce for the transaction
		const nonce = await web3.eth.getTransactionCount(account, 'latest');
		// Convert the requested amount to wei
		const value = web3.utils.toWei(amount);
		// Create a transaction object
		const transaction = {
			from: account,
			to: address,
			value,
			nonce,
			data: web3.utils.toHex(concept),
		};

		// Send the transaction to the blockchain
		const signedTx = await web3.eth.sendTransaction(
			transaction,
			async function (error, hash) {
				if (!error) {
					console.log('The hash of your transaction is: ', hash);
					setAlertMsg(`Enviado correctamente. Transacción: ${hash}`);
					setAlertType('success');
					setShowAlert(true);
					deleteRequest(index, false);
				} else {
					console.log(
						'Something went wrong while submitting your transaction:',
						error
					);
					setAlertType('failure');
					setAlertMsg(`Error: ${error.message}`);
					setShowAlert(true);
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

		// Update the user balance after the transaction is sent
		updateUserBalance(account, web3);
	};

	/* This function handle user request money deny */
	const onDenyRequest = async (index) => {
		deleteRequest(index, true);
	};

	/* This function deletes user request money when is confirmed or denied */
	const deleteRequest = async (index, isDenied) => {
		// Create a new instance of the RequestMoneyContract contract using the contract's ABI and address.
		const contract = new web3.eth.Contract(
			RequestMoneyContract.abi,
			smartcontracts.RequestMoney
		);

		if (isDenied) {
			setAlertMsg(
				'Pago rechazado! Firma para interactuar con el contrato y rechazar la solicitud.'
			);
		} else {
			setAlertMsg(
				'Pago realizado! Firma para interactuar con el contrato y completar la solicitud.'
			);
		}
		setAlertType('info');
		setShowAlert(true);

		// Call the deleteUserRequest method of the contract, passing in the user account and the index of the request to delete.
		await contract.methods
			.deleteUserRequest(account, index)
			.send({ from: account, gasPrice: '1' })
			.on('error', function (error) {
				setAlertType('failure');
				setAlertMsg(`Error:, ${error.message}`);
			})
			.then(() => {
				setAlertMsg('Transacción realizada correctamente!');
				setAlertType('success');
				setTimeout(() => {
					setShowAlert(false);
				}, 5000);
			});

		// Update the state of the requests list by removing the request at the given index.
		setRequests((prev) => {
			return [...prev.slice(0, index), ...prev.slice(index + 1)];
		});
	};

	/* This function is called when user pays an invoice */
	const onPayInvoice = async (contractAddr, index) => {
		// Create a new instance of the InvoiceContract with the contract address.
		const invoiceSC = new web3.eth.Contract(InvoiceContract.abi, contractAddr);
		// Get the invoice information from the smart contract.
		const result = await invoiceSC.methods.getInfo().call({from: account});
		const value = result[3];

		// Send a transaction to the smart contract to pay the invoice.
		const signedTx = await invoiceSC.methods
			.pay()
			.send({ from: account, gasPrice: '1', value }, function (error, hash) {
				if (!error) {
					console.log('The hash of your transaction is: ', hash);
					setAlertMsg(`Factura pagada correctamente. Transacción: ${hash}`);
					setAlertType('success');
					setShowAlert(true);
					setInvoices((prev) => {
						return [...prev.slice(0, index), ...prev.slice(index + 1)];
					});
				} else {
					console.log(
						'Something went wrong while submitting your transaction:',
						error
					);
					setAlertType('failure');
					setAlertMsg(`Error: ${error.message}`);
					setShowAlert(true);
				}
			});

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

		// Update the user balance after the transaction is sent
		updateUserBalance(account, web3);
	};

	/* This function is called when user deny to pay an invoice  */
	const onDenyInvoice = async (contractAddr, invoiceIndex, index) => {
		deleteInvoice(invoiceIndex, index);
	};

	const deleteInvoice = async (invoiceIndex, index) => {
		// Create a contract instance for the Invoices smart contract
		const contract = new web3.eth.Contract(
			InvoicesContract.abi,
			smartcontracts.Invoices
		);

		setAlertMsg(
			'Firma para interactuar con el contrato y rechazar la factura.'
		);
		setAlertType('info');
		setShowAlert(true);
		// Call the setDeniedInvoice function in the smart contract and wait for the transaction to be confirmed
		await contract.methods
			.setDeniedInvoice(account, invoiceIndex)
			.send({ from: account, gasPrice: '1' })
			.on('error', function (error) {
				setAlertType('failure');
				setAlertMsg(`Error:, ${error.message}`);
			})
			.then(() => {
				setAlertMsg('Transacción realizada correctamente!');
				setAlertType('success');
				setShowAlert(true);
				setTimeout(() => {
					setShowAlert(false);
				}, 5000);
			});

		// Remove the deleted invoice from the invoices array
		setInvoices((prev) => {
			return [...prev.slice(0, index), ...prev.slice(index + 1)];
		});
	};

	const onOpenModal = (el) => {
		setDetailedInvoice(el);
		setIsModalVisible(!isModalVisible);
	};

	const onCloseModal = () => {
		setDetailedInvoice(null);
		setIsModalVisible(!isModalVisible);
	};

	const onCloseAlert = () => {
		setShowAlert(false);
	};

	useEffect(() => {
		// Check if web3 is defined
		if (web3 !== undefined) {
			// Function to get user money requests
			const getMoneyRequests = async () => {
				// Instantiate a RequesMoney smart contract object
				const contract = new web3.eth.Contract(
					RequestMoneyContract.abi,
					smartcontracts.RequestMoney
				);
				// Call a contract method to get user requests
				const result = await contract.methods.getUserRequests(account).call({from: account});
				const requests = [];
				// Get the ETH/USD price
				const symbolPrice = await getSymbolPrice('ETH', 'USD');
				for (let i = 0; i < result['0'].length; i++) {
					// Convert the request amount from Wei to ETH
					const value = web3.utils.fromWei(result['1'][i]);
					// Calculate the request amount in USD
					const priceInUSD = (value * symbolPrice.USD).toString();
					// Push a new request object to the requests array
					requests.push({
						address: result['0'][i],
						amountUSD: priceInUSD,
						amountETH: value,
						concept: result['2'][i],
					});
				}
				// Update the state with the requests array and set the loading state to false
				setRequests(requests);
				setLoadingRequests(false);
			};

			// Function to get user pending invoices

			const getPendingInvoices = async () => {
				// Instantiate a Invoices smartcontract object
				const invoicesSC = new web3.eth.Contract(
					InvoicesContract.abi,
					smartcontracts.Invoices
				);
				// Call a contract method to get user invoices
				const pendingInvoices = await invoicesSC.methods
					.getUserInvoices(account)
					.call();
				const invoicesArray = [];
				console.log(pendingInvoices)
				// Get the ETH/USD price
				const symbolPrice = await getSymbolPrice('ETH', 'USD');
				for (let i = 0; i < pendingInvoices[0].length; i++) {
					// Skip invoices that have been denied
					if (pendingInvoices[1][i]) {
						continue;
					}
					// Instantiate a Invoice smartcontract object for each invoice
					const contract = new web3.eth.Contract(
						InvoiceContract.abi,
						pendingInvoices[0][i]
					);

					console.log(contract)

					// Check if the invoice has been paid
					const isPaid = await contract.methods.isPaid().call({from: account});
					console.log('pas')
					// Skip paid invoices
					if (!isPaid) {
						// Get invoice information
						const invoiceInfo = await contract.methods.getInfo().call({from: account});
						// Convert the invoice amount from Wei to ETH
						const value = web3.utils.fromWei(invoiceInfo[3]);
						// Calculate the invoice total in USD
						const total = (value * symbolPrice.USD).toString();
						// Decode the encoded articles parameter
						const encodedArticles = web3.eth.abi.decodeParameter(
							'string',
							invoiceInfo['2']
						);
						// Check if the invoice is overdue
						const isOverdue = await contract.methods.isOverdue().call({from: account});
						// Push a new invoice object to the invoices array
						invoicesArray.push({
							contract: pendingInvoices[0][i],
							contractor: invoiceInfo[0],
							client: invoiceInfo[1],
							total,
							articles: encodedArticles,
							message: invoiceInfo[4],
							dueDate: new Date(invoiceInfo[5] * 1000).toLocaleDateString(),
							discount: invoiceInfo[6],
							otherImport: invoiceInfo[7],
							isOverdue,
							isPaid,
							index: i,
						});
					}
				}
				// Update the state with the invoices array and set the loading state to false
				setInvoices(invoicesArray);
				setLoadingInvoices(false);
			};

			getMoneyRequests();
			getPendingInvoices();
		}
	}, [web3, account]);

	return (
		<>
			<h2 className='text-2xl font-bold dark:text-white'>Notificaciones</h2>
			<h4 className='text-slate-500 dark:text-slate-200'>
				Aqui se muestran todas las acciones que tienes pendientes
			</h4>
			<section className='min-w-sm mt-4 flex flex-col gap-4'>
				<article>
					<h5 className='text-xl font-medium text-black dark:text-white'>
						Solicitudes de cuentas:
					</h5>
					{loadingRequests ? (
						<div className='relative m-auto w-max'>
							<Spinner aria-label='Medium sized spinner example' size='md' />
						</div>
					) : requests.length !== 0 ? (
						<div className='flow-root'>
							<ul className='divide-y divide-gray-200 dark:divide-gray-700'>
								{requests.map((el, index) => (
									<Card key={index} className='mt-2'>
										<li key={index} className='py-1'>
											<div className='flex items-center gap-2 space-x-4 max-sm:flex-col'>
												<div className='min-w-0 flex-1'>
													<p className='break-all text-sm font-medium text-gray-900 dark:text-white'>
														Concepto: {el.concept}
													</p>
													<p className='break-all text-sm text-gray-500 dark:text-gray-400'>
														Solicitante: {el.address}
													</p>
												</div>
												<div className='inline-flex items-center text-base font-semibold text-gray-900 dark:text-white'>
													$ {Math.round(el.amountUSD * 100) / 100}
													<span className='ml-2 text-xs'>
														{el.amountETH} ETH
													</span>
												</div>
												<div className='flex flex-row gap-2'>
													<Button
														size='sm'
														color='success'
														onClick={() =>
															onAcceptRequest(
																{
																	address: el.address,
																	amount: el.amountETH,
																	concept: el.concept,
																},
																index
															)
														}>
														<CheckIcon stroke='2.5' size='h-5 w-5' />
													</Button>
													<Button
														size='sm'
														color='failure'
														onClick={() => onDenyRequest(index)}>
														<Xmark stroke='2.5' size='h-5 w-5' />
													</Button>
												</div>
											</div>
										</li>
									</Card>
								))}
							</ul>
						</div>
					) : (
						<p className='mt-4 rounded-lg border border-gray-300 bg-white p-4 text-center font-semibold shadow-sm dark:border-gray-500 dark:bg-gray-800 dark:text-white'>
							No existen solicitudes de usuarios
						</p>
					)}
				</article>
				<article>
					<h5 className='text-xl font-medium text-black dark:text-white'>
						Facturas pendientes
					</h5>
					{loadingInvoices ? (
						<div className='relative m-auto w-max'>
							<Spinner aria-label='Medium sized spinner example' size='md' />
						</div>
					) : invoices.length === 0 ? (
						<p className='mt-4 rounded-lg border border-gray-300 bg-white p-4 text-center font-semibold shadow-sm dark:border-gray-500 dark:bg-gray-800 dark:text-white'>
							No existen facturas pendientes
						</p>
					) : (
						<div className='flow-root'>
							<ul className='divide-y divide-gray-200 dark:divide-gray-700'>
								{invoices.map((el, index) => (
									<Card
										key={el.contract}
										className={`mt-2 ${el.isOverdue ? 'bg-red-400' : ''}`}>
										<li key={el.ontract} className='py-1'>
											<div className='flex items-center gap-2 space-x-4 max-sm:flex-col'>
												<div className='min-w-0 flex-1'>
													<p className='break-all text-sm font-medium text-gray-900 dark:text-white'>
														Factura: {el.contract}
													</p>
													<p className='break-all text-sm font-normal text-gray-700 dark:text-white'>
														De: {el.contractor}
													</p>
												</div>

												<div className='inline-flex items-center text-base font-semibold text-gray-900 dark:text-white'>
													$ {Math.round(el.total * 100) / 100}
													<span className='ml-2 text-xs'>{el.amountETH}</span>
												</div>

												<div className='flex flex-row gap-2'>
													<Button
														size='sm'
														color='success'
														onClick={() => onPayInvoice(el.contract, index)}>
														<CheckIcon stroke='2.5' size='h-5 w-5' />
													</Button>
													<Button
														size='sm'
														color='failure'
														onClick={() =>
															onDenyInvoice(el.contract, el.index, index)
														}>
														<Xmark stroke='2.5' size='h-5 w-5' />
													</Button>
												</div>
												<button
													className='font-medium text-blue-600 hover:underline'
													onClick={() => onOpenModal(el)}>
													Ver detalles
												</button>
											</div>
										</li>
									</Card>
								))}
							</ul>
						</div>
					)}
				</article>
			</section>
			{detailedInvoice !== null ? (
				<Modal show={isModalVisible} onClose={onCloseModal}>
					<Modal.Header>Detalles de la factura</Modal.Header>
					<Modal.Body className='space-x-0 text-sm dark:text-white'>
						<div className='space-y-1 whitespace-pre-wrap'>
							{Object.keys(detailedInvoice).map((key) => (
								<p key={key} className='b m-0 break-all'>
									<span className='font-semibold'>{key}:</span>{' '}
									{key === 'isOverdue' || key === 'isPaid'
										? detailedInvoice[key].toString()
										: ''}
									{detailedInvoice[key]}
								</p>
							))}
						</div>
					</Modal.Body>
					<Modal.Footer className='flex justify-end'>
						<Button onClick={onCloseModal}>Cerrar</Button>
					</Modal.Footer>
				</Modal>
			) : (
				''
			)}
			{showAlert ? (
				<Alert
					onDismiss={onCloseAlert}
					className='fixed right-2 bottom-2 w-[50%] break-all'
					color={alertType}
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

export default Notifications;
