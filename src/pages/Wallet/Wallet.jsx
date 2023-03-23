import useAuth from '../../hooks/useAuth';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import getSymbolPrice from '../../services/getSymbolPrice';
import EthereumLogo from '../../assets/Ethereum_logo_2014.png';

import HelloWorldAbi from '../../config/abis/HelloWorld.json';

function Wallet() {
	useAuth();
	useDocumentTitle('Wallet');
	const { account, library: web3, chainId, error } = useWeb3React();
	const [balanceEth, setBalanceEth] = useState(0);
	const [balance, setBalance] = useState(0);
	const [gasPrice, setGasPrice] = useState(0);
	const [nodeInfo, setNodeInfo] = useState('');

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

			const contract = new web3.eth.Contract(HelloWorldAbi.abi,'0x55b4D4e52b45eeD2672B9D4dCe386671B4C7B718');
			console.log(contract)
			console.log(await contract.methods.sayHelloWorld().call())
		}

		loadWalletInfo();
	}, [web3]);

	return (
		<>
			<h2 className='text-2xl font-bold'>Wallet</h2>
			{error && <div className='mb-4 text-red-500'>{error}</div>}
			<div className='relative mx-auto mt-8 h-2/4 transform rounded-xl bg-[url(./assets/walletcard_bg.png)] bg-cover p-8 text-white shadow-2xl transition-transform hover:scale-110 sm:w-4/5 md:w-4/5 lg:w-4/5 xl:w-3/5 2xl:w-2/4'>
				<div className='flex h-full w-full flex-col justify-between'>
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
								<p className='text-sm font-medium tracking-wider'>{chainId}</p>
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
		</>
	);
}

export default Wallet;
