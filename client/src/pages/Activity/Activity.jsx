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

	/* This function is called when the search input value changes */
	const onChangeSearch = (event) => {
		// Get the new input value from the event
		const inputValue = event.target.value;
		// Set the new input value to the state variable "inputSearch"
		setInputSearch(inputValue);
		// Filter the transactions using the new input value
		const searchedTxs = filteredTransactions.filter((tx) => {
			// Decode the transaction input data from hex format to string format using web3 utility function
			const message =
				tx.input !== '' ? String(web3.utils.hexToAscii(tx.input)) : '';
			// Check if the transaction hash, sender address, receiver address, or decoded input data includes the new input value
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

	/* This function sorts the filtered transactions based on the selected sort type */
	const sortTransactions = (filteredTxs) => {
		// Declare a new array to store the sorted transactions
		let sortedTxs = [];
		// Check the selected sort type and sort the transactions accordingly
		if (sortType === 'dateNew') {
			// Sort the transactions by timestamp in ascending order and then reverse the array to get the latest transactions first
			sortedTxs = filteredTxs
				.sort((a, b) => a.timestamp - b.timestamp)
				.reverse();
		} else if (sortType === 'dateOld') {
			// Sort the transactions by timestamp in ascending order
			sortedTxs = filteredTxs.sort((a, b) => a.timestamp - b.timestamp);
		} else if (sortType === 'priceLow') {
			// Sort the transactions by value in ascending order and then reverse the array to get the lowest value transactions first
			sortedTxs = filteredTxs.sort((a, b) => a.value - b.value).reverse();
		} else if (sortType === 'priceHigh') {
			// Sort the transactions by value in ascending order
			sortedTxs = filteredTxs.sort((a, b) => a.value - b.value);
		}

		// Set the sorted transactions to the state variables "filteredTransactions" and "transactions"
		setFilteredTransactions(sortedTxs);
		setTransactions(sortedTxs);
	};

	/* This function filtres transactions based on a given date range */
	const filterByDate = (transactions) => {
		// Check if both the from and to dates are provided
		if (dateRange.from !== '' && dateRange.to !== '') {
			// Check if the from date is before or equal to the to date
			if (dateRange.from <= dateRange.to) {
				// If the date range is valid, set the isInvalidDateRange flag to false
				setIsInvalidDateRange(false);
				// Filter the transactions based on the date range.
				const filteredTxs = transactions.filter((tx) => {
					return tx.timestamp >= dateRange.from && tx.timestamp <= dateRange.to;
				});
				// Sort the filtered transactions and update the state variables
				sortTransactions(filteredTxs);
			} else {
				// If the date range is invalid, set the isInvalidDateRange flag to true
				setIsInvalidDateRange(true);
			}
		} else {
			// If the from and to dates are not provided, sort all the transactions and update the state variables
			sortTransactions(transactions);
		}
	};

	/* This function applies the filters set by the user */
	const onApplyFilters = () => {
		// Get transactions
		getTransactions(account, web3)
			.then((res) => {
				// Filter transactions based on selected filters
				const filteredTxs = res.filter((tx) => {
					if (priceFrom !== null && priceTo !== null) {
						// Calculate ETH price of the transaction
						const txPrice =
							Math.round(ethPrice * web3.utils.fromWei(tx.value) * 100) / 100;
						// Check if transaction price is within selected range
						if (txPrice >= priceFrom && txPrice <= priceTo) {
							if (showPays && showInc) {
								return true;
							}
							if (showPays) {
								// Check if transaction is a payment made by the user's account
								return tx.from === account;
							}
							if (showInc) {
								// Check if transaction is an incoming payment to the user's account
								return tx.to === account;
							}
						}
						// If transaction is outside price range or does not match payment type, exclude it
						return false;
					} else {
						// If price range is not selected, filter based on payment type only
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
        			// If payment type is not selected, exclude the transaction
					return null;
				});

				// Apply date range filter
				if (!isInvalidDateRange) {
					filterByDate(filteredTxs);
					return;
				}
			
      			// Sort transactions based on selected sorting type
				sortTransactions(filteredTxs);
			})
			.catch((err) => console.error(err));
	};

	/* This function decodes the input data of a transaction to extract the contract name and method used in the call */
	const decodeInput = (input, contractAddr) => {
		let abi = null;
		let contractName = '';
		// Checks if the contract address matches any of the predefined smart contracts and sets the appropriate ABI and contract name
		if (contractAddr === smartcontracts.RequestMoney) {
			abi = RequestMoney.abi;
			contractName = 'RequestMoney';
		} else if (contractAddr === smartcontracts.Invoices) {
			abi = InvoicesContract.abi;
			contractName = 'Invoices';
		} else if (contractAddr === null || invoices.includes(contractAddr)) {
			abi = InvoiceContract.abi;
			contractName = 'Invoice';
		}

		// If no ABI is found, returns the input data as ASCII
		if (abi === null) {
			return web3.utils.hexToAscii(input);
		} else {
			// If ABI is found, uses the InputDataDecoder library to decode the input data and extract the method used
			const decoder = new InputDataDecoder(abi);
			const result = decoder.decodeData(input);
			return `${contractName} - method: ${result.method || 'deploy'}`;
		}
	};

	useEffect(() => {	
		// Check if web3 object is defined
		if (web3 !== undefined) {
			// Create a new instance of the Invoices smart contract
			const invoicesSC = new web3.eth.Contract(
				InvoicesContract.abi,
				smartcontracts.Invoices
			);

			// Call the getUserInvoices method from the Invoices smart contract to retrieve the user's invoices and update the state
			invoicesSC.methods
				.getUserInvoices(account)
				.call()
				.then((res) => {
					setInvoices(res[0]);
				});

			// Call the getTransactions function to retrieve the user's transactions and update the state
			getTransactions(account, web3)
				.then((res) => {
					setTransactions(res.reverse());
					isLoading(false);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}, [web3, account]);

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
