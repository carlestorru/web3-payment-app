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
	Spinner,
} from 'flowbite-react';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import Datepicker from 'tailwind-datepicker-react';
import getTransactions from '../../services/getTransactions';
import getSymbolPrice from '../../services/getSymbolPrice';
import smartcontracts from '../../config/smartcontracts';
import RequestMoney from '../../contracts/RequestMoney.json';
import InvoicesContract from '../../contracts/Invoices.json';
import InvoiceContract from '../../contracts/Invoice.json';
import InputDataDecoder from 'ethereum-input-data-decoder';

const datePickerOptions = {
	autoHide: true,
	todayBtn: false,
	clearBtn: false,
	maxDate: new Date('2030-01-01'),
	minDate: new Date('1950-01-01'),
	theme: {
		background: '',
		todayBtn: '',
		clearBtn: '',
		icons: '',
		text: '',
		disabledText: '',
		input: '',
		inputIcon: '',
		selected: '',
	},
	datepickerClassNames: '',
	defaultDate: '',
	language: 'es',
};

function Activity() {
	const { account, library: web3 } = useWeb3React();
	const [transactions, setTransactions] = useState([]);
	const [filteredTransactions, setFilteredTransactions] = useState([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [detailedTx, setDetailedTx] = useState(null);
	const [inputSearch, setInputSearch] = useState('');
	const [dateRange, setDateRange] = useState({ from: '', to: '' });
	const [showDatePickerTo, setShowDatePickerTo] = useState(false);
	const [showDatePickerFrom, setShowDatePickerFrom] = useState(false);
	const [isInvalidDateRange, setIsInvalidDateRange] = useState(false);
	const [showPays, setShowPays] = useState(true);
	const [showInc, setShowInc] = useState(true);
	const [sortType, setSortType] = useState('dateNew');
	const [priceFrom, setPriceFrom] = useState(null);
	const [priceTo, setPriceTo] = useState(null);
	const [loading, isLoading] = useState(true);
	const [ethPrice, setEthPrice] = useState(1);
	const [invoices, setInvoices] = useState([]);

	useAuth();
	useDocumentTitle('Actividad');

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
		const searchedTxs = filteredTransactions.filter((tx) => {
			const message =
				tx.input !== '' ? String(web3.utils.hexToAscii(tx.input)) : '';
			return (
				tx.hash.startsWith(inputValue) ||
				tx.from.startsWith(inputValue) ||
				tx.to.startsWith(inputValue) ||
				message.includes(inputValue)
			);
		});

		setTransactions(searchedTxs);
	};

	const onCheckPayments = () => {
		setShowPays((prev) => !prev);
	};

	const onCheckIncomes = () => {
		setShowInc((prev) => !prev);
	};

	const onChangeSort = (event) => {
		setSortType(event.target.value);
	};

	const onChangePriceFrom = (event) => {
		if (event.target.value === '') {
			setPriceFrom(null);
		} else {
			setPriceFrom(Number(event.target.value));
		}
	};

	const onChangePriceTo = (event) => {
		if (event.target.value === '') {
			setPriceTo(null);
		} else {
			setPriceTo(Number(event.target.value));
		}
	};

	const handleChangeDateFrom = (selectedDate) => {
		const timestamp = new Date(selectedDate / 1000).getTime();
		setDateRange((prev) => ({ ...prev, from: timestamp }));
	};

	const handleChangeDateTo = (selectedDate) => {
		const timestamp = new Date(selectedDate / 1000).getTime();
		setDateRange((prev) => ({ ...prev, to: timestamp }));
	};

	const handleCloseDatePickerFrom = (state) => {
		setShowDatePickerFrom(state);
	};

	const handleCloseDatePickerTo = (state) => {
		setShowDatePickerTo(state);
	};

	const sortTransactions = (filteredTxs) => {
		let sortedTxs = [];
		if (sortType === 'dateNew') {
			sortedTxs = filteredTxs
				.sort((a, b) => a.timestamp - b.timestamp)
				.reverse();
		} else if (sortType === 'dateOld') {
			sortedTxs = filteredTxs.sort((a, b) => a.timestamp - b.timestamp);
		} else if (sortType === 'priceLow') {
			sortedTxs = filteredTxs.sort((a, b) => a.value - b.value).reverse();
		} else if (sortType === 'priceHigh') {
			sortedTxs = filteredTxs.sort((a, b) => a.value - b.value);
		}
		setFilteredTransactions(sortedTxs);
		setTransactions(sortedTxs);
	};

	const filterByDate = (transactions) => {
		if (dateRange.from !== '' && dateRange.to !== '') {
			if (dateRange.from <= dateRange.to) {
				setIsInvalidDateRange(false);
				const filteredTxs = transactions.filter((tx) => {
					return tx.timestamp >= dateRange.from && tx.timestamp <= dateRange.to;
				});
				sortTransactions(filteredTxs);
			} else {
				setIsInvalidDateRange(true);
			}
		} else {
			sortTransactions(transactions);
		}
	};

	const onApplyFilters = () => {
		getTransactions(account, web3)
			.then((res) => {
				const filteredTxs = res.filter((tx) => {
					if (priceFrom !== null && priceTo !== null) {
						const txPrice =
							Math.round(ethPrice * web3.utils.fromWei(tx.value) * 100) / 100;
						if (txPrice >= priceFrom && txPrice <= priceTo) {
							if (showPays && showInc) {
								return true;
							}
							if (showPays) {
								return tx.from === account;
							}
							if (showInc) {
								return tx.to === account;
							}
						}
						return false;
					} else {
						if (showPays && showInc) {
							return true;
						}
						if (showPays) {
							return tx.from === account;
						}
						if (showInc) {
							return tx.to === account;
						}
					}

					return null;
				});

				if (!isInvalidDateRange) {
					filterByDate(filteredTxs);
					return;
				}

				sortTransactions(filteredTxs);
			})
			.catch((err) => console.error(err));
	};

	useEffect(() => {
		
		if (web3 !== undefined) {
			const invoicesSC = new web3.eth.Contract(
				InvoicesContract.abi,
				smartcontracts.Invoices
			);
			invoicesSC.methods
				.getUserInvoices(account)
				.call().then(res => {
					setInvoices(res[0])
				});

			getTransactions(account, web3)
				.then((res) => {
					setTransactions(res);
					isLoading(false);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}, [web3, account]);

	const decodeInput = (input, contractAddr) => {
		let abi = null;
		let contractName = '';
		if (contractAddr === smartcontracts.RequestMoney) {
			abi = RequestMoney.abi;
			contractName = 'RequestMoney';
		} else if (contractAddr === smartcontracts.Invoices) {
			abi = InvoicesContract.abi;
			contractName = 'Invoices';
		} else if (contractAddr === null || invoices.includes(contractAddr)){
			abi = InvoiceContract.abi;
			contractName = 'Invoice';
		}

		if (abi === null) {
			return web3.utils.hexToAscii(input);
		} else {
			const decoder = new InputDataDecoder(abi);
			const result = decoder.decodeData(input);
			return `${contractName} - method: ${result.method || 'deploy'}`;
		}
	};

	useEffect(() => {
		getSymbolPrice('ETH', 'USD').then((res) => setEthPrice(res.USD));
		onApplyFilters();
		filterByDate(transactions);
	}, [dateRange]);

	return (
		<>
			<h2 className='text-2xl font-bold dark:text-white'>Actividad</h2>
			<h4 className='text-slate-500 dark:text-slate-200'>
				Visión general de los mercados y últimos pedidos
			</h4>
			{/* FILTERS */}
			<section className='pt-4'>
				<div className='flex flex-row items-center justify-between gap-2 pb-12 max-sm:flex-col'>
					{/* SEARCH BAR */}
					<div className='sm:self-end '>
						<label htmlFor='table-search' className='sr-only'>
							Buscar
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
								className='block min-w-[300px] overflow-hidden rounded-lg border border-gray-300 bg-gray-50 p-2 pl-10 text-sm text-gray-900 focus:border-blue-700 focus:ring-blue-700 dark:bg-gray-700 dark:text-gray-100'
								placeholder='Buscar'
								value={inputSearch}
								onChange={onChangeSearch}
							/>
						</div>
					</div>
					<div className='flow-row flex items-center gap-4 max-sm:flex-col'>
						{/* DATEPICKER */}
						<div>
							<div className='flex flex-row items-center gap-2'>
								<div>
									<div className='mb-2 block'>
										<Label
											className='font-normal'
											htmlFor='from'
											value='Desde'
										/>
									</div>
									<div>
										<Datepicker
											options={datePickerOptions}
											onChange={handleChangeDateFrom}
											show={showDatePickerFrom}
											setShow={handleCloseDatePickerFrom}
										/>
									</div>
								</div>
								<div className='mt-5'>
									<p>-</p>
								</div>
								<div>
									<div className='mb-2 block'>
										<Label className='font-normal' htmlFor='to' value='Hasta' />
									</div>
									<div>
										<Datepicker
											options={datePickerOptions}
											onChange={handleChangeDateTo}
											show={showDatePickerTo}
											setShow={handleCloseDatePickerTo}
										/>
									</div>
								</div>
							</div>
							{isInvalidDateRange ? (
								<p className='absolute mt-3 text-sm text-red-600 max-sm:relative'>
									Rango de fechas inválido
								</p>
							) : (
								''
							)}
						</div>
						{/* FILTERS */}
						<div className='self-end max-sm:self-center'>
							<Dropdown
								dismissOnClick={false}
								label='Filtrar'
								placement='bottom'>
								<Dropdown.Item>
									<div className='flex items-center gap-2'>
										<Label htmlFor='sort'>Ordenar por:</Label>
										<Select id='sort' required={true} onChange={onChangeSort}>
											<option value='dateNew'>Fecha: Más recientes</option>
											<option value='dateOld'>Fecha: Más antiguas</option>
											<option value='priceHigh'>
												Precio: De menor a mayor
											</option>
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
								<Dropdown.Header>
									<span className='mb-2 block text-sm font-medium'>Precio</span>
									<div className='flex flex-row items-center gap-2'>
										<div>
											<div className='mb-2 block'>
												<Label
													className='font-normal'
													htmlFor='from'
													value='Desde'
												/>
											</div>
											<TextInput
												id='from'
												type='text'
												sizing='sm'
												placeholder='ex.: 0'
												onChange={onChangePriceFrom}
											/>
										</div>
										<div className='mt-5'>
											<p>-</p>
										</div>
										<div>
											<div className='mb-2 block'>
												<Label
													className='font-normal'
													htmlFor='to'
													value='Hasta'
												/>
											</div>
											<TextInput
												id='to'
												type='text'
												sizing='sm'
												placeholder='ex.:100'
												onChange={onChangePriceTo}
											/>
										</div>
									</div>
								</Dropdown.Header>
								<Dropdown.Divider />
								<Dropdown.Item>
									<Button onClick={onApplyFilters}>Aplicar</Button>
								</Dropdown.Item>
							</Dropdown>
						</div>
					</div>
				</div>
				{/* TABLE */}
				{loading ? (
					<div className='relative m-auto w-max'>
						<Spinner aria-label='Extra large spinner example' size='xl' />
					</div>
				) : transactions.length === 0 ? (
					<p className='pt-4 text-center font-semibold dark:text-white'>
						No existen transacciones para esta cuenta
					</p>
				) : (
					<Table hoverable={true} className='overflow-x-auto'>
						<Table.Head className='bg-blue-700 text-gray-50 dark:bg-blue-700'>
							<Table.HeadCell className='text-white'>Fecha</Table.HeadCell>
							<Table.HeadCell className='text-white'>
								ID. transacción
							</Table.HeadCell>
							<Table.HeadCell className='text-white'>De / Para</Table.HeadCell>
							<Table.HeadCell className='text-white'>Cantidad</Table.HeadCell>
							<Table.HeadCell className='text-white'>Mensaje</Table.HeadCell>
							<Table.HeadCell>
								<span className='sr-only'>Edit</span>
							</Table.HeadCell>
						</Table.Head>
						<Table.Body className='divide-y dark:text-gray-200'>
							{transactions.map((tx) => (
								<Table.Row
									key={tx.hash}
									className='bg-white dark:border-gray-700 dark:bg-gray-800'>
									<Table.Cell className='whitespace-nowrap font-medium'>
										{tx.date + ' ' + tx.time}
									</Table.Cell>
									<Table.Cell className='whitespace-nowrap'>
										{tx.hash
											.slice(0, 5)
											.concat(
												'...',
												tx.hash.slice(tx.hash.length - 4, tx.hash.length)
											)}
									</Table.Cell>
									<Table.Cell>
										{tx.to
											? tx.to
													.slice(0, 5)
													.concat(
														'...',
														tx.to.slice(tx.to.length - 4, tx.to.length)
													)
											: 'Creación SmartContract'}
									</Table.Cell>
									<Table.Cell className='whitespace-nowrap'>
										<span
											className={
												tx.from === account
													? `font-medium text-red-500`
													: `font-medium text-green-500`
											}>
											{' '}
											{tx.from === account ? '-' : '+'} ${' '}
											{Math.round(
												ethPrice * web3.utils.fromWei(tx.value) * 100
											) / 100}
										</span>
										<span className='text-xs'>
											{' '}
											({web3.utils.fromWei(tx.value)} ETH)
										</span>
									</Table.Cell>
									<Table.Cell className=''>
										{decodeInput(tx.input, tx.to)}
									</Table.Cell>
									<Table.Cell className='text-center'>
										<button
											className='font-medium text-blue-600 hover:underline'
											onClick={() => onOpenModal(tx)}>
											Ver detalles
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
					<Modal.Body className='space-x-0 text-sm dark:text-white'>
						<div className='space-y-1 whitespace-pre-wrap'>
							{Object.keys(detailedTx).map((key) => (
								<p
									key={key}
									className={`${
										key === 'input' ? 'line-clamp-3' : ''
									} b m-0 break-all`}>
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
