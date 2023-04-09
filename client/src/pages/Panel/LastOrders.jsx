import { Table, Alert, Spinner } from 'flowbite-react';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import getTransactions from '../../services/getTransactions';
import { HiInformationCircle } from '../../components/Icons/HiInformationCircle';
import { Link } from 'react-router-dom';

export function LastOrders() {
	const { account, library: web3, error } = useWeb3React();
	const [transactions, setTransactions] = useState([]);
	const [loading, isLoading] = useState(true);

	useEffect(() => {
		if (web3 !== undefined) {
			getTransactions(account, web3).then((res) => {
				const lastTenTxs = res.slice(Math.max(res.length - 10, 0));
				setTransactions(lastTenTxs);
				isLoading(false);
			});
		}
	}, [web3]);

	return (
		<section className='col-span-8 flex flex-col gap-2 max-sm:col-span-8'>
			<h3 className='text-xl font-bold'>Últimas transacciones</h3>
			<h6 className='text-slate-500 text-sm'>
				Puedes consultar el historial de transacciones desde el apartado <Link to='/activity'><span className='font-semibold underline text-blue-700'>Actividad</span></Link>.
			</h6>
			{error ? (
				<Alert
					className='absolute right-2 bottom-2'
					color='failure'
					icon={HiInformationCircle}>
					<span>
						<span className='font-medium'>{error.message}</span>
					</span>
				</Alert>
			) : loading ? (
				<div className='relative m-auto w-max'>
					<Spinner aria-label='Medium sized spinner example' size='md' />
				</div>
			) : (
				<Table hoverable={true}>
					<Table.Head className='bg-blue-700 text-gray-50'>
						<Table.HeadCell className='text-white'>Fecha</Table.HeadCell>
						<Table.HeadCell className='text-white'>
							ID. transacción
						</Table.HeadCell>
						<Table.HeadCell className='text-white'>De / Para</Table.HeadCell>
						<Table.HeadCell className='text-white'>Precio</Table.HeadCell>
					</Table.Head>
					<Table.Body className='divide-y'>
						{transactions.map((tx) => (
							<Table.Row key={tx.hash} className='bg-white'>
								<Table.Cell className='whitespace-nowrap font-medium'>
									{tx.date + ' ' + tx.time}
								</Table.Cell>
								<Table.Cell className='whitespace-nowrap'>
									{tx.hash
										.slice(0, 10)
										.concat(
											'...',
											tx.hash.slice(tx.hash.length - 9, tx.hash.length)
										)}
								</Table.Cell>
								<Table.Cell>{tx.to}</Table.Cell>
								<Table.Cell className='whitespace-nowrap'>
									<span
										className={
											tx.from === account ? `text-red-500 font-medium` : `text-green-500 font-medium`
										}>
										{' '}
										- {web3.utils.fromWei(tx.value)} ETH
									</span>
								</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table>
			)}
		</section>
	);
}
