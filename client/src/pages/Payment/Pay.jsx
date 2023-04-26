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

	const onAcceptPayment = async () => {
		const nonce = await web3.eth.getTransactionCount(account, 'latest');
		const symConversion = await getSymbolPrice('USD', 'ETH');
		const dolarsToEth = (params.price * symConversion.ETH).toFixed(6);
		const value = web3.utils.toWei(dolarsToEth.toString(), 'ether');

		const gasPrice = await web3.eth.getGasPrice();

		const transaction = {
			from: account,
			to: ecommerces[params.ecommerce].address,
			value: value,
			nonce: nonce,
			gasPrice: gasPrice,
			data: web3.utils.toHex(ecommerces[params.ecommerce].name),
		};

		if (!payGas) {
			const gasLimit = await web3.eth.estimateGas(transaction);
			const transactionFee = gasPrice * gasLimit;
			transaction.gas = gasLimit;
			transaction.value = value - transactionFee;
			// console.log(web3.utils.fromWei(transactionFee.toString(), 'ether'));
		}

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

		window.opener.postMessage(insertedTx.hash, '*');
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
			const balanceWei = await web3.eth.getBalance(account);
			const balanceEther = web3.utils.fromWei(balanceWei, 'ether');
			const balance = await getSymbolPrice('ETH', 'USD');
			setEthPrice(balance.USD);
			// const gasPrice = await web3.eth.getGasPrice();
			setBalanceEth(Math.round(balanceEther * 100) / 100);
			setBalance(Math.round(balance.USD * balanceEther * 100) / 100);
		}

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
