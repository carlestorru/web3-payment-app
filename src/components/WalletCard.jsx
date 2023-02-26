import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import EthereumLogo from '../assets/Ethereum_logo_2014.png';
import { Clipboard } from './Icons/Outlined/Clipboard';

export function Wallet() {
	const { chainId, account, library } = useWeb3React();
	const [balance, setBalance] = useState('');
	const [splitedAccount, setSplitedAccount] = useState(account);

	const web3 = library;

	const splitAccount = () => {
		return account
			.slice(0, 5)
			.concat('...', account.slice(account.length - 4, account.length));
	};

	useEffect(() => {
		if (web3 !== undefined) {
			web3.eth
				.getBalance(account)
				.then((result) => setBalance(web3.utils.fromWei(result)));

			setSplitedAccount(splitAccount());
		}
	}, [account, web3]);

	const copyToClipboard = () => {
		navigator.clipboard.writeText(account);
	};

	return (
		<div className='flex flex-col gap-2 text-center'>
			<div className='flex flex-col items-center justify-around px-2'>
				<img className='h-10 w-6 m-2' src={EthereumLogo} alt='Ethereum Logo' />
				<div className='flex flex-row gap-1 justify-between'>
					<h2
						title={account}
						className='w-full overflow-hidden text-ellipsis whitespace-nowrap'>
						Account: <strong>{splitedAccount}</strong>
					</h2>
				<button className='hover:text-black' onClick={copyToClipboard}>
					<Clipboard />
				</button>
				</div>
				<h3 className='text-2xl'>{Math.round(balance * 100) / 100} ETH</h3>
			</div>
			<p className='text-sm text-slate-500'>Connected to the {chainId} chain</p>
		</div>
	);
}
