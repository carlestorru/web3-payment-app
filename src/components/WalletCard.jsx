import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import EthereumLogo from '../assets/Ethereum_logo_2014.png';

export function Wallet() {
	const { chainId, account, library } = useWeb3React();
	const [balance, setBalance] = useState('');
	const [splitedAccount, setSplitedAccount] = useState(account);

	const web3 = library;

	const splitAccount = (account) => {
		return account
			.slice(0, 5)
			.concat('...', account.slice(account.length - 4, account.length));
	};

	useEffect(() => {
		if (web3 !== undefined) {
			web3.eth
				.getBalance(account)
				.then((result) => setBalance(web3.utils.fromWei(result)));

			setSplitedAccount(splitAccount(account));
		}
	}, [account, web3]);

	return (
		<div className='flex flex-col gap-3 text-center'>
			<div className='flex flex-row items-center justify-around px-2'>
				<img className='h-10 w-6' src={EthereumLogo} alt='Ethereum Logo' />
				<div>
					<h2
						title={account}
						className='w-full overflow-hidden text-ellipsis whitespace-nowrap'>
						Account: <strong>{splitedAccount}</strong>
					</h2>
					<h3 className='text-2xl'>{Math.round(balance * 100) / 100} ETH</h3>
				</div>
			</div>
			<p className='text-sm text-slate-500'>Connected to the {chainId} chain</p>
		</div>
	);
}
