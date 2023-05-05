import useAuth from '../../hooks/useAuth';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button, Checkbox, Label } from 'flowbite-react';
import Logo from '../../assets/3pay_logo/4x/3pay_logo_blue@4x.png';
import { useWeb3React } from '@web3-react/core';
import { useState, useEffect } from 'react';
import getUsername from '../../services/getUsername';
import getSymbolPrice from '../../services/getSymbolPrice';
import ecommerces from '../../config/ecommerces.js';

function Pay() {
	useAuth();
	useDocumentTitle('Pay');

	const navigate = useNavigate();
	const { account, library: web3 } = useWeb3React();
	const [username, setUsername] = useState(null);
	const [balanceEth, setBalanceEth] = useState(0);
	const [balance, setBalance] = useState(0);
	const [ethPrice, setEthPrice] = useState(1);
	const [payGas, setPayGas] = useState(false);

	const params = useParams();

	/* This function handle user payment confirmation */
	const onAcceptPayment = async () => {
		// Get the current transaction count for the specified account
		const nonce = await web3.eth.getTransactionCount(account, 'latest');
		// Get the current symbol price conversion rate for USD to ETH
		const symConversion = await getSymbolPrice('USD', 'ETH');
		// Convert the price in USD to ETH and round to 6 decimal places
		const dolarsToEth = (params.price * symConversion.ETH).toFixed(6);
		// Convert the ETH amount to a wei value for the transaction
		const value = web3.utils.toWei(dolarsToEth.toString(), 'ether');
		// Get the current gas price for the transaction
		const gasPrice = await web3.eth.getGasPrice();
		// Create a new transaction object with the specified parameters
		const transaction = {
			from: account,
			to: ecommerces[params.ecommerce].address,
			value,
			nonce,
			gasPrice,
			data: web3.utils.toHex(ecommerces[params.ecommerce].name),
		};

		// If the payGas is not set, estimate the gas limit for the transaction
		if (!payGas) {
			// Estimate the gas limit for the transaction
			const gasLimit = await web3.eth.estimateGas(transaction);
			// Calculate the transaction fee based on the gas limit and price
			const transactionFee = gasPrice * gasLimit;
			// Set the gas limit and update the value with the transaction fee
			transaction.gas = gasLimit;
			transaction.value = value - transactionFee;
		}

		// Send the transaction to the blockchain
		const signedTx = await web3.eth.sendTransaction(
			transaction,
			function (error, hash) {
				if (!error) {
					console.log('The hash of your transaction is: ', hash);
				} else {
					console.log(
						'Something went wrong while submitting your transaction:',
						error
					);
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

		// Send a message to the parent window with the transaction hash
		window.opener.postMessage(insertedTx.hash, '*');
		// Navigate to the activity page
		navigate('/activity');
	};

	const onCancelPayment = () => {
		navigate('/activity');
	};

	const onCheckGasPay = async () => {
		setPayGas((prev) => !prev);
	};

	useEffect(() => {
		if (account !== undefined) {
			getUsername(account)
				.then((res) => {
					setUsername(res[0].username);
				})
				.catch((err) => {
					console.error(`API no disponible: ${err}`);
				});
		}
	}, [account]);

	useEffect(() => {
		async function loadWalletInfo() {
			// Get the current ETH balance in Wei and convert it to Ether
			const balanceWei = await web3.eth.getBalance(account);
			const balanceEther = web3.utils.fromWei(balanceWei, 'ether');
			// Get the current ETH price in USD
			const balance = await getSymbolPrice('ETH', 'USD');
			// Set `ethPrice` state with the result
			setEthPrice(balance.USD);
			// Round the Ether balance to two decimal places and update the `balanceEth` state with the result
			setBalanceEth(Math.round(balanceEther * 100) / 100);
			// Calculate the USD balance and update the `balance` state with the result
			setBalance(Math.round(balance.USD * balanceEther * 100) / 100);
		}

		// Check if web3 is defined before loadWalletInfo
		if (web3 !== undefined) {
			loadWalletInfo();
		}
	}, [web3, account]);

	return (
		<main className='min-h-screen flex-1 overflow-auto bg-slate-100 p-10'>
			<Link to='/'>
				<img className='w-34 m-auto h-16' src={Logo} alt='3pay logo' />
			</Link>
			<section>
				<div className='mx-auto max-w-screen-xl px-4 py-8'>
					<div className='mx-auto max-w-3xl'>
						<header className='text-center'>
							<h2 className='text-2xl font-bold text-gray-900 sm:text-2xl'>
								Pago: Tu compra
							</h2>
						</header>
						<div className='mt-8'>
							<div className='m-auto flex flex-col rounded-xl bg-white p-8 shadow-md'>
								<img
									className='relative h-7 w-12 self-end'
									src={Logo}
									alt='3pay logo'
								/>
								Hola, {username !== null ? `${username}` : ''}
								<p className='mt-3'>Confirma tu compra en, </p>
								<h5 className='font-medium'>
									{ecommerces[params.ecommerce].name}
								</h5>
								<p className='mt-3 break-all'>
									Cuenta: <span className='font-light italic'>{account}</span>
								</p>
								<p className=''>
									Saldo:{' '}
									<span className='font-light italic'>
										$ {balance} <small>( {balanceEth} ETH )</small>{' '}
									</span>
								</p>
								<p className='mt-3 break-all'>
									Destinatario:{' '}
									<span className='font-light italic'>
										{ecommerces[params.ecommerce].address}
									</span>
								</p>
								<div className='mt-4 flex gap-2'>
									<div className='flex h-5 items-center'>
										<Checkbox
											id='gaspay'
											onChange={onCheckGasPay}
											defaultChecked={payGas}
										/>
									</div>
									<div className='flex flex-col'>
										<Label htmlFor='gaspay'>Pagar tarifa de gas</Label>
										<div className='text-gray-500 dark:text-gray-300'>
											<span className='text-xs font-normal'>
												Si marcas esta casilla, confirmas que quieres asumir los
												costes de la transacion. Por el contrario corren a cargo
												del destinatario.
											</span>
										</div>
									</div>
								</div>
								<p className=' mt-6 text-right text-xl'>
									Total:{' '}
									<span className='text-2xl font-bold'>
										$ {params.price}{' '}
										<small className='text-sm'>
											( {params.price / ethPrice} ETH )
										</small>
									</span>
								</p>
								<div className='mt-8 flex flex-row justify-center gap-4'>
									<Button className='w-32' onClick={onAcceptPayment}>
										Aceptar
									</Button>
									<Button
										className='w-32'
										color='failure'
										outline={true}
										onClick={onCancelPayment}>
										Cancelar
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}

export default Pay;
