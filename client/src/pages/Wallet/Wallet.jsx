import useAuth from '../../hooks/useAuth';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import getSymbolPrice from '../../services/getSymbolPrice';
import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';
import HelloWorldAbi from '../../contracts/HelloWorld.json';
import { ArrowDownTray } from '../../components/Icons/Outlined/Arrow';
import { Button } from 'flowbite-react';

import EthereumLogo from '../../assets/Ethereum_logo_2014.png';
import WalletBackgroundBlue from '../../assets/walletcard_bg_blue.png';
import WalletBackgroundOrange from '../../assets/walletcard_bg_orange.png';
import WalletBackgroundMetamask from '../../assets/walletcard_bg_metamask.png';
import WalletBackgroundEth from '../../assets/walletcard_bg_eth.png';
import smartcontracts from '../../config/smartcontracts';

const walletColors = {
	walletBlue: WalletBackgroundBlue,
	walletOrange: WalletBackgroundOrange,
	walletMetamask: WalletBackgroundMetamask,
	walletEth: WalletBackgroundEth
};

function Wallet() {
	useAuth();
	useDocumentTitle('Wallet');
	const { account, library: web3, chainId, error } = useWeb3React();
	const [balanceEth, setBalanceEth] = useState(0);
	const [balance, setBalance] = useState(0);
	const [gasPrice, setGasPrice] = useState(0);
	const [nodeInfo, setNodeInfo] = useState('');
	const [walletBg, setWalletBg] = useState(WalletBackgroundBlue);

	const generatePDF = () => {
		const input = document.getElementById('wallet-card');
		html2canvas(input).then((canvas) => {
			const imgData = canvas.toDataURL('image/jpg');
			const pdf = new JsPDF('landscape', 'mm', [85, 53]);
			const pageWidth = pdf.internal.pageSize.getWidth();
			const pageHeight = pdf.internal.pageSize.getHeight();
			pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight);
			pdf.save('wallet.pdf');
		});
	};

	const onChangeWalletBg = (event) => {
		const colorId = event.currentTarget.id;
		setWalletBg(walletColors[colorId]);
	};

	useEffect(() => {
		async function loadWalletInfo() {
			const balanceWei = await web3.eth.getBalance(account);
			const balanceEther = web3.utils.fromWei(balanceWei, 'ether');
			const balance = await getSymbolPrice('ETH', 'USD');
			const gasPrice = await web3.eth.getGasPrice();
			const nodeInfo = await web3.eth.getNodeInfo();
			setBalanceEth(balanceEther);
			setGasPrice(web3.utils.fromWei(gasPrice));
			setNodeInfo(nodeInfo);
			setBalance(balance.USD * balanceEther);

			const contract = new web3.eth.Contract(
				HelloWorldAbi.abi,
				smartcontracts.HelloWorld
			);
			console.log(contract);
			console.log(await contract.methods.hi().call());
		}

		if (web3 !== undefined) {
			loadWalletInfo();
		}
	}, [web3]);

	return (
		<>
			<h2 className='text-2xl font-bold dark:text-white'>Wallet</h2>
			<h4 className='text-slate-500 dark:text-slate-200'>
				Consulta y personaliza tu billetera
			</h4>
			{error ? (
				<div className='mb-4 text-red-500'>{error.message}</div>
			) : (
				<section className='flex flex-col items-center gap-12'>
					<div
						id='wallet-card'
						className='relative mx-auto mt-8 mb-6 h-2/4 transform rounded-xl text-white shadow-2xl transition-transform hover:scale-110 sm:w-4/5 md:w-4/5 lg:w-4/5 xl:w-3/5 2xl:w-2/4'>
						<img
							src={walletBg}
							alt='wallet-background-blue'
							className='absolute -z-10 h-full w-full rounded-xl object-cover'
						/>
						<div className='flex h-full w-full flex-col justify-between p-8'>
							<div>
								<div className='flex flex-row justify-between gap-4'>
									<div className='flex flex-col justify-start gap-4 break-all'>
										<div>
											<p className='font-light'>Address</p>
											<p className='font-medium tracking-wider'>{account}</p>
										</div>
										<div>
											<p className='font-light'>Balance Eth</p>
											<p className='font-medium tracking-widest'>
												{balanceEth} ETH
											</p>
										</div>
										<div>
											<p className='font-light'>Balance</p>
											<p className='text-xl font-medium tracking-widest'>
												$ {balance}
											</p>
										</div>
									</div>
									<img className='h-16 w-10' src={EthereumLogo} />
								</div>
							</div>

							<div className='pt-6 pr-6'>
								<div className='flex justify-between max-sm:flex-col max-sm:gap-2'>
									<div>
										<p className='text-xs font-light'>Chain Id</p>
										<p className='text-sm font-medium tracking-wider'>
											{chainId}
										</p>
									</div>
									<div>
										<p className='text-xs font-light'>Gas Price</p>
										<p className='text-sm font-medium tracking-wider'>
											{gasPrice} ETH
										</p>
									</div>

									<div>
										<p className='text-xs font-light'>Node Info</p>
										<p className='tracking-more-wider text-sm font-bold'>
											{nodeInfo}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
					<section className='flex flex-row gap-6 items-center'>
						<h3 className='font-medium text-black dark:text-white'>Personaliza tu tarjeta: </h3>
						<button id='walletBlue' onClick={onChangeWalletBg}>
							<img
								className='h-10 w-10 rounded-full transform transition-transform hover:scale-110'
								src={WalletBackgroundBlue}
								alt='bg_blue'
							/>
						</button>
						<button id='walletOrange' onClick={onChangeWalletBg}>
							<img
								className='h-10 w-10 rounded-full transition-transform hover:scale-110'
								src={WalletBackgroundOrange}
								alt='bg_orange'
							/>
						</button>
						<button id='walletMetamask' onClick={onChangeWalletBg}>
							<img
								className='h-10 w-10 rounded-full transition-transform hover:scale-110'
								src={WalletBackgroundMetamask}
								alt='bg_metamask'
							/>
						</button>
						<button id='walletEth' onClick={onChangeWalletBg}>
							<img
								className='h-10 w-10 rounded-full transition-transform hover:scale-110'
								src={WalletBackgroundEth}
								alt='bg_eth'
							/>
						</button>
					</section>
					<Button onClick={generatePDF}>
						<ArrowDownTray className='mr-2' />
						Descargar
					</Button>
				</section>
			)}
		</>
	);
}

export default Wallet;
