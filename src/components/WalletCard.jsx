import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import EthereumLogo from '../assets/Ethereum_logo_2014.png';

export function Wallet() {
	const { chainId, account, library } = useWeb3React();
	const [balance, setBalance] = useState('');

	const web3 = library;

	useEffect(() => {
		if (web3 !== undefined) {
			web3.eth
				.getBalance(account)
				.then((result) => setBalance(web3.utils.fromWei(result)));
		}
	}, [account, web3]);

	return (
		<div className='flex flex-col items-center px-2 text-center gap-1'>
			<img className='h-14 w-10' src={EthereumLogo} alt='Ethereum Logo' />
			<h2 title={account} className='w-full overflow-hidden whitespace-nowrap text-ellipsis'>Account: {account}</h2>
			<h3>{Math.round(balance * 100) / 100} ETH</h3>
			<h4>Connected to the {chainId} chain</h4>
		</div>
	);
}
