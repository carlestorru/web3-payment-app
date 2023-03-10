import useAuth from '../../hooks/useAuth';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { Table } from 'flowbite-react';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import getTransacctionsByAccount from '../../services/getTransactionsByAccount';
import { Link } from 'react-router-dom';

function Activity() {
	const { account, library: web3 } = useWeb3React();
	const [transactions, setTransactions] = useState({ from: [], to: [] });

	useEffect(() => {
		if (web3 !== undefined) {
			getTransacctionsByAccount(account, web3).then((res) => {
				setTransactions(res);
			});
		}
	}, [web3]);
	useAuth();
	useDocumentTitle('Activity');

	return (
		<>
			<h2 className='text-2xl font-bold'>Activity</h2>
			<h4 className='text-slate-500'>
				Visión general de los mercados y últimos pedidos
			</h4>
			<section className='pt-4'>
				{transactions.from.length === 0 && transactions.to.length === 0 ? (
					<p className='pt-4 text-center font-semibold'>
						No existen transacciones para esta cuenta
					</p>
				) : (
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
										<Link
											to={`/activity/${tx.hash}`}
											className='font-medium text-blue-600 hover:underline dark:text-blue-500'>
											Ver
										</Link>
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
										<Link
											to={`/activity/${tx.hash}`}
											className='font-medium text-blue-600 hover:underline dark:text-blue-500'>
											Ver
										</Link>
									</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table>
				)}
			</section>
		</>
	);
}

export default Activity;
