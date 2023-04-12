import { useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import RequestMoneyContract from '../../contracts/RequestMoney.json';
import { useWeb3React } from '@web3-react/core';

function Notifications() {
	useAuth();
	useDocumentTitle('Notifications');
	const { account, library: web3 } = useWeb3React();

	useEffect(() => {
		if (web3 !== undefined) {
			const getMoneyRequests = async () => {
				const contract = new web3.eth.Contract(
					RequestMoneyContract.abi,
					'0xfEd0ACFB4bD21908bcde020415C536e9952a1da5'
				);
				console.log(await contract.methods.getUserRequests(account).call());
			};

			getMoneyRequests();
		}
	}, [web3]);

	return (
		<>
			<h2 className='text-2xl font-bold dark:text-white'>Notificaciones</h2>
			<h4 className='text-slate-500 dark:text-slate-200'>
				Visión general de los mercados y últimos pedidos
			</h4>
		</>
	);
}

export default Notifications;
