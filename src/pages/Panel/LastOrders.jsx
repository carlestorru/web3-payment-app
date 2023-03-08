import { Table } from 'flowbite-react';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import getTransacctionsByAccount from '../../services/getTransactionsByAccount';

export function LastOrders() {
	const { account, library: web3 } = useWeb3React();
	const [transactions, setTransactions] = useState({ from: [], to: [] });

	useEffect(() => {
		if (web3 !== undefined) {
			getTransacctionsByAccount(account, web3).then((res) => {
				setTransactions(res);
				console.log(transactions);
			});
		}
	}, []);

	return (
		<section className='col-span-3 row-span-1 flex flex-col gap-4 '>
			<h3 className='text-xl font-bold'>Últimas transacciones</h3>
			<Table hoverable={true}>
				<Table.Head>
					<Table.HeadCell>ID. transacción</Table.HeadCell>
					<Table.HeadCell>De</Table.HeadCell>
					<Table.HeadCell>Para</Table.HeadCell>
					<Table.HeadCell>Precio</Table.HeadCell>
					<Table.HeadCell>
						<span className='sr-only'>Edit</span>
					</Table.HeadCell>
				</Table.Head>
				<Table.Body className='divide-y'>
					{transactions.from.map((tx) => (
						<Table.Row
							key={tx.hash}
							className='bg-white dark:border-gray-700 dark:bg-gray-800'>
							<Table.Cell className='whitespace-nowrap font-semibold text-gray-900 dark:text-white'>
								{tx.hash}
							</Table.Cell>
							<Table.Cell className='font-medium'>{tx.from}</Table.Cell>
							<Table.Cell>{tx.to}</Table.Cell>
							<Table.Cell className='whitespace-nowrap'>
								{web3.utils.fromWei(tx.value)} ETH
							</Table.Cell>
							<Table.Cell>
								<a
									href='/tables'
									className='font-medium text-blue-600 hover:underline dark:text-blue-500'>
									Edit
								</a>
							</Table.Cell>
						</Table.Row>
					))}
					{transactions.to.map((tx) => (
						<Table.Row
							key={tx.hash}
							className='bg-white dark:border-gray-700 dark:bg-gray-800'>
							<Table.Cell className='whitespace-nowrap font-semibold text-gray-900 dark:text-white'>
								{tx.hash}
							</Table.Cell>
							<Table.Cell>{tx.from}</Table.Cell>
							<Table.Cell className='font-medium'>{tx.to}</Table.Cell>
							<Table.Cell className='whitespace-nowrap'>
								{web3.utils.fromWei(tx.value)} ETH
							</Table.Cell>
							<Table.Cell>
								<a
									href='/tables'
									className='font-medium text-blue-600 hover:underline dark:text-blue-500'>
									Edit
								</a>
							</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table>
		</section>
	);
}
