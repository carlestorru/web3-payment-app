import useAuth from '../../hooks/useAuth';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { Table, Modal, Button } from 'flowbite-react';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import getTransacctionsByAccount from '../../services/getTransactionsByAccount';

function Activity() {
	const { account, library: web3 } = useWeb3React();
	const [transactions, setTransactions] = useState({ from: [], to: [] });
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [detailedTx, setDetailedTx] = useState(null);
	const [inputSearch, setInputSearch] = useState('');

	useEffect(() => {
		if (web3 !== undefined) {
			getTransacctionsByAccount(account, web3).then((res) => {
				setTransactions(res);
			});
		}
	}, [web3]);
	useAuth();
	useDocumentTitle('Activity');

	const onOpenModal = (el) => {
		setDetailedTx(el);
		setIsModalVisible(!isModalVisible);
	};

	const onCloseModal = () => {
		setDetailedTx(null);
		setIsModalVisible(!isModalVisible);
	};

	const onChangeSearch = (event) => {
		const inputValue = event.target.value;
		setInputSearch(inputValue);
		getTransacctionsByAccount(account, web3).then((res) => {
			const filteredFromTxs = res.from.filter(
				(tx) =>
					tx.hash.startsWith(inputValue) ||
					tx.from.startsWith(inputValue) ||
					tx.to.startsWith(inputValue)
			);
			const filteredToTxs = res.to.filter(
				(tx) =>
					tx.hash.startsWith(inputValue) ||
					tx.from.startsWith(inputValue) ||
					tx.to.startsWith(inputValue)
			);

			setTransactions({ from: filteredFromTxs, to: filteredToTxs });
		});
	};

	return (
		<>
			<h2 className='text-2xl font-bold'>Activity</h2>
			<h4 className='text-slate-500'>
				Visión general de los mercados y últimos pedidos
			</h4>
			<section className='pt-4'>
				<div className='flex flex-row'>
					<div className='pb-4'>
						<label htmlFor='table-search' className='sr-only'>
							Search
						</label>
						<div className='relative mt-1'>
							<div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
								<svg
									className='h-5 w-5 text-gray-500'
									aria-hidden='true'
									fill='currentColor'
									viewBox='0 0 20 20'
									xmlns='http://www.w3.org/2000/svg'>
									<path
										fillRule='evenodd'
										d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
										clipRule='evenodd'></path>
								</svg>
							</div>
							<input
								type='text'
								id='table-search'
								className='block w-80 rounded-lg border border-gray-300 bg-gray-50 p-2 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500'
								placeholder='Buscar...'
								value={inputSearch}
								onChange={onChangeSearch}
							/>
						</div>
					</div>
					<input placeholder='hola' />
				</div>
				{transactions.from.length === 0 && transactions.to.length === 0 ? (
					<p className='pt-4 text-center font-semibold'>
						No existen transacciones para esta cuenta
					</p>
				) : (
					<Table hoverable={true} className='w-full overflow-x-auto'>
						<Table.Head className='bg-blue-500 text-gray-50'>
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
								<Table.Row key={tx.hash} className='bg-white'>
									<Table.Cell className='whitespace-nowrap font-medium text-gray-900'>
										{tx.hash}
									</Table.Cell>
									<Table.Cell>{tx.from}</Table.Cell>
									<Table.Cell>{tx.to}</Table.Cell>
									<Table.Cell className='whitespace-nowrap'>
										{web3.utils.fromWei(tx.value)} ETH
									</Table.Cell>
									<Table.Cell>
										<button
											className='font-medium text-blue-600 hover:underline'
											onClick={() => onOpenModal(tx)}>
											Ver
										</button>
									</Table.Cell>
								</Table.Row>
							))}
							{transactions.to.map((tx) => (
								<Table.Row key={tx.hash} className='bg-white'>
									<Table.Cell className='whitespace-nowrap font-medium text-gray-900'>
										{tx.hash}
									</Table.Cell>
									<Table.Cell>{tx.from}</Table.Cell>
									<Table.Cell>{tx.to}</Table.Cell>
									<Table.Cell className='whitespace-nowrap'>
										{web3.utils.fromWei(tx.value)} ETH
									</Table.Cell>
									<Table.Cell>
										<button
											className='font-medium text-blue-600 hover:underline'
											onClick={() => onOpenModal(tx)}>
											Ver
										</button>
									</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table>
				)}
			</section>
			{detailedTx !== null ? (
				<Modal show={isModalVisible} onClose={onCloseModal}>
					<Modal.Header>Detalles de la transacción</Modal.Header>
					<Modal.Body className='space-x-0 text-sm'>
						<div className='space-y-1 whitespace-pre-wrap'>
							{Object.keys(detailedTx).map((key) => (
								<p key={key} className='b m-0 break-all'>
									<span className='font-semibold'>{key}:</span>{' '}
									{detailedTx[key]}
								</p>
							))}
						</div>
					</Modal.Body>
					<Modal.Footer className='flex justify-end'>
						<Button outline={true} onClick={onCloseModal}>
							Cerrar
						</Button>
					</Modal.Footer>
				</Modal>
			) : (
				''
			)}
		</>
	);
}

export default Activity;
