import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import RequestMoneyContract from '../../contracts/RequestMoney.json';
import { useWeb3React } from '@web3-react/core';
import { Card, Button } from 'flowbite-react';
import { CheckIcon } from '../../components/Icons/Check';
import { Xmark } from '../../components/Icons/Xmark';
import smartcontracts from '../../config/smartcontracts';

function Notifications() {
	useAuth();
	useDocumentTitle('Notifications');
	const { account, library: web3 } = useWeb3React();
	const [requests, setRequests] = useState([]);

	const onAcceptRequest = async ({ address, amount, concept }, index) => {
		console.log({ address, amount, concept, index });
		const nonce = await web3.eth.getTransactionCount(account, 'latest');

		const value = web3.utils.toWei(amount);

		const transaction = {
			from: account,
			to: address,
			value: value,
			nonce: nonce,
			data: web3.utils.toHex(concept),
		};

		const signedTx = await web3.eth.sendTransaction(
			transaction,
			async function (error, hash) {
				if (!error) {
					console.log('The hash of your transaction is: ', hash);
					deleteRequest(index);
				} else {
					console.log(
						'Something went wrong while submitting your transaction:',
						error
					);
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
	};

	const onDenyRequest = async (index) => {
		console.log({ account, index });
		deleteRequest(index);
	};

	const deleteRequest = (index) => {
		const contract = new web3.eth.Contract(
			RequestMoneyContract.abi,
			smartcontracts.RequestMoney
		);
		contract.methods
			.deleteUserRequest(account, index)
			.send({ from: account, gasPrice: '1' })
			.then(console.log);
	};

	useEffect(() => {
		if (web3 !== undefined) {
			const getMoneyRequests = async () => {
				const contract = new web3.eth.Contract(
					RequestMoneyContract.abi,
					smartcontracts.RequestMoney
				);
				const result = await contract.methods.getUserRequests(account).call();
				const requests = [];
				for (let i = 0; i < result['0'].length; i++) {
					requests.push({
						address: result['0'][i],
						amount: result['1'][i],
						concept: result['2'][i],
					});
				}
				setRequests(requests);
			};

			getMoneyRequests();
		}
	}, [web3]);

	return (
		<>
			<h2 className='text-2xl font-bold dark:text-white'>Notificaciones</h2>
			<h4 className='text-slate-500 dark:text-slate-200'>
				Aqui se muestran todas las acciones que tienes pendientes
			</h4>
			<section className='min-w-sm mt-4'>
				<h5 className='text-xl font-medium text-black dark:text-white'>
					Solicitudes de cuentas:
				</h5>
				{requests.length !== 0 ? (
					<Card className='mt-2'>
						<div className='flow-root'>
							<ul className='divide-y divide-gray-200 dark:divide-gray-700'>
								{requests.map((el, index) => (
									<li key={index} className='py-3 sm:py-4'>
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
												{el.amount} ETH
											</div>
											<div className='flex flex-row gap-2'>
												<Button
													size='sm'
													color='success'
													onClick={() =>
														onAcceptRequest(
															{
																address: el.address,
																amount: el.amount,
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
								))}
							</ul>
						</div>
					</Card>
				) : (
					<p className='pt-4 text-center font-semibold dark:text-white'>
						No existen solicitudes de usuarios
					</p>
				)}
			</section>
		</>
	);
}

export default Notifications;
