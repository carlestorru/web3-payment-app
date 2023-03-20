import useAuth from '../../hooks/useAuth';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import {
	Table,
	Modal,
	Button,
	Dropdown,
	Checkbox,
	Label,
	TextInput,
	Select,
} from 'flowbite-react';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import getTransacctionsByAccount from '../../services/getTransactionsByAccount';

function Activity() {
	const { account, library: web3 } = useWeb3React();
	const [transactions, setTransactions] = useState([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [detailedTx, setDetailedTx] = useState(null);
	const [inputSearch, setInputSearch] = useState('');
	const [showPays, setShowPays] = useState(true);
	const [showInc, setShowInc] = useState(true);
	const [sortType, setSortType] = useState('dateNew');


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
			const searchedTxs = res.filter(
				(tx) =>
					tx.hash.startsWith(inputValue) ||
					tx.from.startsWith(inputValue) ||
					tx.to.startsWith(inputValue)
			);

			setTransactions(searchedTxs);
		});
	};

	const onCheckPayments = () => {
		setShowPays((prev) => !prev);
	};

	const onCheckIncomes = () => {
		setShowInc((prev) => !prev);
	};

	const onChangeSort = (event) => {
		setSortType(event.target.value)
	}

	const sortTransactions = (filteredTxs) => {
		let sortedTxs = [];
		if (sortType === 'dateNew') {
			sortedTxs = filteredTxs.sort((a, b) => a.timestamp - b.timestamp).reverse();
			setTransactions(sortedTxs);
		} else if (sortType === 'dateOld') {
			sortedTxs = filteredTxs.sort((a, b) => a.timestamp - b.timestamp);
			setTransactions(sortedTxs);
		} else if (sortType === 'priceLow') {
			sortedTxs = filteredTxs.sort((a, b) => a.value.localeCompare(b.value)).reverse();
			setTransactions(sortedTxs);
		} else if (sortType === 'priceHigh') {
			sortedTxs = filteredTxs.sort((a, b) => a.value.localeCompare(b.value));
			setTransactions(sortedTxs);
		}
	}

	const onApplyFilters = () => {
		getTransacctionsByAccount(account, web3).then((res) => {
			const filteredTxs = res.filter((tx) => {
				if (showPays && showInc) {
					return true;
				}
				if (showPays) {
					return tx.from === account;
				}
				if (showInc) {
					return tx.to === account;
				}
				return null;
			});

			sortTransactions(filteredTxs);
		});

	};

	return (
		<>
			<h2 className='text-2xl font-bold'>Activity</h2>
			<h4 className='text-slate-500'>
				Visión general de los mercados y últimos pedidos
			</h4>
			<section className='pt-4'>
				<div className='flex flex-row items-center justify-between pb-4'>
					<div>
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
					<Dropdown dismissOnClick={false} label='Filtrar'>
						<Dropdown.Item>
							<div className='flex items-center gap-2'>
								<Label htmlFor='sort'>Ordenar por:</Label>
								<Select id='sort' required={true} onChange={onChangeSort} >
									<option value='dateNew'>Fecha: Más recientes</option>
									<option value='dateOld'>Fecha: Más antiguas</option>
									<option value='priceHigh'>Precio: De menor a mayor</option>
									<option value='priceLow'>Precio: De mayor a menor</option>
								</Select>
							</div>
						</Dropdown.Item>
						<Dropdown.Divider />
						<Dropdown.Item>
							<div className='flex items-center gap-2'>
								<Checkbox
									id='payments'
									defaultChecked={showPays}
									onClick={onCheckPayments}
								/>
								<Label htmlFor='payments'>Pagos</Label>
							</div>
						</Dropdown.Item>
						<Dropdown.Item>
							<div className='flex items-center gap-2'>
								<Checkbox
									id='incomes'
									defaultChecked={showInc}
									onClick={onCheckIncomes}
								/>
								<Label htmlFor='incomes'>Ingresos</Label>
							</div>
						</Dropdown.Item>
						<Dropdown.Divider />
						<Dropdown.Item>
							<div className='flex flex-row items-center gap-2'>
								<div>
									<div className='mb-2 block'>
										<Label htmlFor='from' value='Desde' />
									</div>
									<TextInput
										id='from'
										type='text'
										sizing='sm'
										placeholder='ex.: 0'
									/>
								</div>
								<div className='mt-5'>
									<p>-</p>
								</div>
								<div>
									<div className='mb-2 block'>
										<Label htmlFor='to' value='Hasta' />
									</div>
									<TextInput
										id='to'
										type='text'
										sizing='sm'
										placeholder='ex.:100'
									/>
								</div>
							</div>
						</Dropdown.Item>
						<Dropdown.Divider />
						<Dropdown.Item>
							<Button onClick={onApplyFilters}>Aplicar</Button>
						</Dropdown.Item>
					</Dropdown>
				</div>
				{transactions.length === 0 ? (
					<p className='pt-4 text-center font-semibold'>
						No existen transacciones para esta cuenta
					</p>
				) : (
					<Table hoverable={true} className='w-full overflow-x-auto'>
						<Table.Head className='bg-blue-500'>
							<Table.HeadCell className='text-white'>
								ID. transacción
							</Table.HeadCell>
							<Table.HeadCell className='text-white'>De / Para</Table.HeadCell>
							<Table.HeadCell className='text-white'>Cantidad</Table.HeadCell>
							<Table.HeadCell>
								<span className='sr-only'>Edit</span>
							</Table.HeadCell>
						</Table.Head>
						<Table.Body className='divide-y'>
							{transactions.map((tx) => (
								<Table.Row key={tx.hash} className='bg-white'>
									<Table.Cell className='whitespace-nowrap font-medium text-gray-900'>
										{tx.hash}
									</Table.Cell>
									<Table.Cell>{tx.to}</Table.Cell>
									<Table.Cell className='whitespace-nowrap'>
										<span
											className={
												tx.from === account ? `text-red-500` : `text-green-500`
											}>
											{' '}
											{tx.from === account ? '-' : '+'}{' '}
											{web3.utils.fromWei(tx.value)} ETH
										</span>
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
						<Button onClick={onCloseModal}>Cerrar</Button>
					</Modal.Footer>
				</Modal>
			) : (
				''
			)}
		</>
	);
}

export default Activity;
