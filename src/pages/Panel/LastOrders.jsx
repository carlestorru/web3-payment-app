import { Table } from 'flowbite-react';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import getTransacctionsByAccount from '../../services/getTransactionsByAccount';

export function LastOrders() {
	const { account, library: web3 } = useWeb3React();
	const [transactions, setTransactions] = useState([]);

	useEffect(() => {
		if (web3 !== undefined) {
			getTransacctionsByAccount(account, web3).then((res) => {
				const lastTenTxs = res.slice(Math.max(res.length - 10, 0))
				setTransactions(lastTenTxs);
			});
		}
	}, [web3]);

	return (
		<section className='col-span-7 flex flex-col gap-4 max-sm:col-span-8'>
			<h3 className='text-xl font-bold'>Últimas transacciones</h3>
			<Table hoverable={true}>
				<Table.Head className='bg-blue-500 text-gray-50'>
					<Table.HeadCell className='text-white'>
						ID. transacción
					</Table.HeadCell>
					<Table.HeadCell className='text-white'>De / Para</Table.HeadCell>
					<Table.HeadCell className='text-white'>Precio</Table.HeadCell>
				</Table.Head>
				<Table.Body className='divide-y'>
					{transactions.map((tx) => (
						<Table.Row key={tx.hash} className='bg-white'>
							<Table.Cell className='whitespace-nowrap font-medium text-gray-900'>
								{tx.hash}
							</Table.Cell>
							<Table.Cell>{tx.to}</Table.Cell>
							<Table.Cell className='whitespace-nowrap'>
								<span className={tx.from === account ? `text-red-500` : `text-green-500`}>
									{' '}
									- {web3.utils.fromWei(tx.value)} ETH
								</span>
							</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table>
		</section>
	);
}
