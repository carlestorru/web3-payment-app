import useAuth from '../../hooks/useAuth';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { Label, TextInput, Button, Textarea, Card } from 'flowbite-react';
import { useEffect, useState } from 'react';
import getUsername from '../../services/getUsername';
import Datepicker from 'tailwind-datepicker-react';
import { useWeb3React } from '@web3-react/core';
import InvoiceContract from '../../contracts/Invoice.json';
import InvoicesContract from '../../contracts/Invoices.json';
// import getSymbolPrice from '../../services/getSymbolPrice';
import smartcontracts from '../../config/smartcontracts';
import { CheckIcon } from '../../components/Icons/Check';
import { Xmark } from '../../components/Icons/Xmark';

const datePickerOptions = {
	autoHide: true,
	todayBtn: false,
	clearBtn: false,
	maxDate: new Date('2030-01-01'),
	minDate: new Date(),
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
	datepickerClassNames: 'top-50',
	defaultDate: '',
	language: 'es',
};

function Invoices() {
	const { account, library: web3 } = useWeb3React();
	useAuth();
	useDocumentTitle('Facturas');
	const [invoice, setInvoice] = useState({
		address: '',
		articles: [],
		message: '',
		dueDate: '',
		subtotal: 0,
		discount: 0,
		otherImport: 0,
		total: 0,
	});
	const [timer, setTimer] = useState(null);
	const [userResults, setUserResults] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [haveDiscount, setHaveDiscount] = useState(false);
	const [haveOtherImport, setHaveOtherImport] = useState(false);
	const [pendingInvoices, setPendingInvoices] = useState([]);

	const onSubmit = async (event) => {
		event.preventDefault();
		console.log(invoice);
		console.log(JSON.stringify(invoice.articles));
		
		const contract = new web3.eth.Contract(InvoiceContract.abi, '0x762BA00Cb6255026ac65F4C9fc339b6a358660B4');

		console.log(await contract.methods.isOverdue().call())

		const result = await contract.methods.getInfo().call();

		const encodedArticles = web3.eth.abi.decodeParameter(
			'string',
			result['2']
		);

		console.log(JSON.parse(encodedArticles))

		// contract.methods.pagar().send({from: account, gasPrice: '1', value}).then(console.log)

/*
		const invoiceSC = new web3.eth.Contract(InvoiceContract.abi);
		const symConversion = await getSymbolPrice('USD', 'ETH');
		const dolarsToEth = invoice.total * symConversion.ETH;
		console.log(dolarsToEth);
		const value = web3.utils.toWei(dolarsToEth.toString());
		console.log(value); // eslint-disable-next-line no-sequences

		const encodedArticles = web3.eth.abi.encodeParameter(
			'string',
			JSON.stringify(invoice.articles)
		);
		console.log(invoice.articles);
		console.log(encodedArticles);
		invoiceSC
			.deploy({
				data: InvoiceContract.bytecode,
				arguments: [
					invoice.address,
					encodedArticles,
					value,
					invoice.dueDate,
					invoice.message,
					invoice.discount,
					invoice.otherImport,
				],
			})
			.send({ from: account })
			.then(function (newContractInstance) {
				console.log(newContractInstance.options.address);
				const invoicesSC = new web3.eth.Contract(
					InvoicesContract.abi,
					smartcontracts.Invoices
				);
				invoicesSC.methods
					.insertInvoice(invoice.address, newContractInstance.options.address)
					.send({ from: account, gasPrice: '1' })
					.then(console.log);
			});
			*/
	};

	const findUsernames = (event) => {
		if (event.target.value.length !== 0) {
			clearTimeout(timer);

			const newTimer = setTimeout(async () => {
				try {
					const result = await getUsername(event.target.value);
					setUserResults(result === null ? [] : result);
					setSelectedUser(null);
				} catch (err) {
					console.error(`API no disponible: ${err}`);
				}
			}, 500);

			setTimer(newTimer);
			setInvoice((invoice) => {
				return { ...invoice, address: event.target.value };
			});
		} else {
			setUserResults([]);
		}
	};

	const selectUser = (user) => {
		document.getElementById('addressTo').value = user.hash;
		setSelectedUser(user);
		setInvoice((invoice) => {
			return { ...invoice, address: user.hash };
		});
	};

	const addArticle = (event) => {
		event.preventDefault();
		const fields = Object.fromEntries(new window.FormData(event.target));
		const subtotal =
			invoice.subtotal + Math.round(fields.price * fields.quantity * 100) / 100;
		const newArticlesArray = invoice.articles.concat(fields);
		setInvoice((prev) => {
			return {
				...prev,
				articles: newArticlesArray,
				subtotal,
				total: subtotal - invoice.discount + invoice.otherImport,
			};
		});

		document.getElementById('invArticleName').value = '';
		document.getElementById('invArticleQty').value = '';
		document.getElementById('invArticlePrice').value = '';
		document.getElementById('invArticleDesc').value = '';
	};

	const deleteArticle = (index) => {
		const subtotal =
			invoice.subtotal -
			invoice.articles[index].price * invoice.articles[index].quantity;
		setInvoice((prev) => {
			return {
				...prev,
				articles: [
					...prev.articles.slice(0, index),
					...prev.articles.slice(index + 1),
				],
				subtotal,
				total: subtotal - invoice.discount + invoice.otherImport,
			};
		});
	};

	const handleChangeDate = (selectedDate) => {
		const timestamp = new Date(selectedDate / 1000).getTime();
		setInvoice((invoice) => {
			return { ...invoice, dueDate: timestamp };
		});
	};

	const handleCloseDatePicker = (state) => {
		setShowDatePicker(state);
	};

	const onChangeInvoiceMsg = (event) => {
		setInvoice((invoice) => {
			return { ...invoice, message: event.target.value };
		});
	};

	const onAddDiscount = () => {
		setHaveDiscount(true);
	};

	const onAddOtherImport = () => {
		setHaveOtherImport(true);
	};

	const onChangeDiscount = (event) => {
		const discount = Number(event.target.value);
		setInvoice((invoice) => {
			return {
				...invoice,
				discount,
				total: invoice.subtotal - discount + invoice.otherImport,
			};
		});
	};

	const onChangeOtherImport = (event) => {
		const otherImport = Number(event.target.value);
		setInvoice((invoice) => {
			return {
				...invoice,
				otherImport,
				total: invoice.subtotal - invoice.discount + otherImport,
			};
		});
	};

	useEffect(() => {
		if (web3 !== undefined) {
			const getPendingInvoices = async () => {
				const invoicesSC = new web3.eth.Contract(
					InvoicesContract.abi,
					smartcontracts.Invoices
				);
				const result = await invoicesSC.methods.getUserInvoices(account).call();
				console.log(result);
				const invoices = [];
				for (let i = 0; i < result['0'].length; i++) {
					invoices.push({
						contract: result['0'][i],
						isPaid: result['1'][i],
					});
				}
				setPendingInvoices(invoices);
			};
			getPendingInvoices();
		}
	}, [web3, account]);

	return (
		<>
			<h2 className='text-2xl font-bold dark:text-white'>Facturas</h2>
			<h4 className='text-slate-500 dark:text-slate-200'>
				Crea y consulta tus facturas
			</h4>

			<section className='mt-4 flex flex-col gap-8'>
				<div>
					<h6 className='text-xl font-semibold dark:text-slate-200'>
						Facturas pendientes
					</h6>
					{pendingInvoices.length === 0 ? (
						<p className='mt-4 rounded-lg border border-gray-300 bg-white p-4 text-center font-semibold shadow-sm dark:border-gray-500 dark:bg-gray-800 dark:text-white'>
							No existen facturas pendientes
						</p>
					) : (
						<Card className='mt-2'>
							<div className='flow-root'>
								<ul className='divide-y divide-gray-200 dark:divide-gray-700'>
									{pendingInvoices.map((el, index) => (
										<li key={index} className='py-3 sm:py-4'>
											<div className='flex items-center gap-2 space-x-4 max-sm:flex-col'>
												<div className='min-w-0 flex-1'>
													<p className='break-all text-sm font-medium text-gray-900 dark:text-white'>
														Contract: {el.contract}
													</p>
													<p className='break-all text-sm text-gray-500 dark:text-gray-400'>
														Pagada: {el.isPaid.toString()}
													</p>
												</div>
												{/*
										<div className='inline-flex items-center text-base font-semibold text-gray-900 dark:text-white'>
											$ {Math.round(el.amountUSD * 100) / 100}
											<span className='ml-2 text-xs'>{el.amountETH} ETH</span>
										</div> */}
												<div className='flex flex-row gap-2'>
													<Button
														size='sm'
														color='success'
														onClick={() => console.log(el.contract)}>
														<CheckIcon stroke='2.5' size='h-5 w-5' />
													</Button>
													<Button
														size='sm'
														color='failure'
														onClick={() => console.log(el.contract)}>
														<Xmark stroke='2.5' size='h-5 w-5' />
													</Button>
												</div>
											</div>
										</li>
									))}
								</ul>
							</div>
						</Card>
					)}
				</div>
				<div>
					<div className='flex flex-col gap-4'>
						<article className='flex flex-row justify-between'>
							<h6 className='text-xl font-semibold dark:text-slate-200'>
								Nueva factura
							</h6>
							<Button onClick={onSubmit}>Enviar</Button>
						</article>
						<div className='flex flex-col gap-8 lg:grid lg:grid-cols-4'>
							<article className='col-span-3 flex flex-col content-center justify-center gap-8 rounded-lg border border-gray-300 bg-white p-4 shadow-sm dark:border-gray-500 dark:bg-gray-800'>
								<div>
									<div className='mb-2 block'>
										<Label
											className='font-bold'
											htmlFor='address'
											value='Factura para'
										/>
									</div>
									<TextInput
										id='addressTo'
										name='address'
										shadow={true}
										placeholder='Introduce una dirección wallet...'
										required={true}
										onChange={findUsernames}
									/>
									{userResults.length > 0 && selectedUser === null ? (
										<div>
											<ul className='max-h-48 w-full overflow-y-auto rounded-b-lg border border-gray-100 bg-white p-1 dark:bg-gray-700'>
												{userResults.map((el) => {
													return (
														<li
															className='border-b-[1px] border-b-gray-600 p-1 text-sm text-black hover:cursor-pointer hover:bg-blue-300 hover:bg-opacity-40 dark:border-b-gray-300 dark:text-white hover:dark:bg-blue-600'
															key={el.username}
															onClick={() => selectUser(el)}>
															<p>
																Usuario:{' '}
																<span className='font-medium'>
																	{el.username}
																</span>
															</p>
															<p className='text-xs text-gray-500 dark:text-gray-100'>
																{el.hash}
															</p>
														</li>
													);
												})}
											</ul>
										</div>
									) : (
										''
									)}
								</div>

								<div className='flex flex-col gap-2'>
									<div className='mb-2 block'>
										<Label className='font-bold' value='Artículos' />
									</div>
									{invoice.articles.length !== 0
										? invoice.articles.map((el, index) => (
												<div key={el.name} className='flex flex-row gap-1'>
													<div className='flex-1 rounded-lg border border-gray-300 p-4'>
														<div className='flex flex-row gap-2 max-md:flex-col'>
															<TextInput
																className='flex-auto'
																name='name'
																defaultValue={el.name}
																readOnly={true}
															/>
															<div className='flex flex-1 flex-row gap-2'>
																<TextInput
																	className='flex-auto'
																	name='quantity'
																	defaultValue={el.quantity}
																	readOnly={true}
																/>
																<TextInput
																	className='flex-auto'
																	name='price'
																	defaultValue={el.price}
																	readOnly={true}
																/>
															</div>
														</div>
														<Textarea
															className='mt-2 text-sm'
															name='description'
															defaultValue={el.description}
															placeholder='Descripción (opcional)'
															readOnly={true}
															rows={3}
														/>
														<p className='mt-2 text-right text-xs font-bold'>
															Importe{' '}
															{Math.round(el.quantity * el.price * 100) / 100}
														</p>
													</div>
													<button onClick={() => deleteArticle(index)}>
														<Xmark stroke='2.5' size='h-4 w-4' />
													</button>
												</div>
										  ))
										: ''}
									<form onSubmit={addArticle}>
										<div className='rounded-lg border border-gray-300 p-4 dark:border-gray-500'>
											<div className='flex flex-row gap-2 max-md:flex-col'>
												<TextInput
													id='invArticleName'
													className='flex-auto'
													type='text'
													name='name'
													placeholder='Nombre del artículo'
													required={true}
												/>
												<div className='flex flex-1 flex-row gap-2'>
													<TextInput
														id='invArticleQty'
														className='flex-auto [appearance:textfield]'
														name='quantity'
														placeholder='Cantidad'
														type='number'
														required={true}
													/>
													<TextInput
														id='invArticlePrice'
														className='flex-auto [appearance:textfield]'
														name='price'
														placeholder='Precio'
														type='number'
														step='any'
														required={true}
													/>
												</div>
											</div>
											<Textarea
												id='invArticleDesc'
												className='mt-2 text-sm'
												name='description'
												placeholder='Descripción (opcional)'
												rows={3}
											/>
											<p className='mt-2 text-right text-xs font-bold dark:text-white'>
												Importe $ 0.00
											</p>
										</div>
										<button
											className='mt-4 self-start text-sm font-medium text-blue-700'
											type='submit'>
											+ Añadir articulo o servicio
										</button>
									</form>
								</div>

								<div>
									<div className='mb-2 block'>
										<Label
											className='font-bold'
											htmlFor='message'
											value='Mensaje para el cliente'
										/>
									</div>
									<Textarea
										id='invoiceMessage'
										name='message'
										placeholder='Escribe un mensaje...'
										onChange={onChangeInvoiceMsg}
										rows={3}
									/>
								</div>
							</article>
							<article className='col-span-1 flex h-fit flex-col content-center justify-start gap-4 rounded-lg border border-gray-300 bg-white  p-4 shadow-sm dark:border-gray-500 dark:bg-gray-800'>
								<div className='border-b border-b-slate-300 pb-4 dark:border-b-slate-500'>
									<div className='mb-2 block'>
										<Label htmlFor='duedate' value='Fecha de vencimiento' />
									</div>
									<div>
										<Datepicker
											options={datePickerOptions}
											onChange={handleChangeDate}
											show={showDatePicker}
											setShow={handleCloseDatePicker}
										/>
									</div>
								</div>
								<div className='flex flex-col gap-4 border-b border-b-slate-300 pb-4  dark:border-b-slate-500'>
									<div className='flex flex-row justify-between'>
										<Label
											className='text-gray-500'
											htmlFor='subtotal'
											value='Subtotal'
										/>
										<Label
											className='text-gray-500'
											htmlFor='subtotal'
											value={invoice.subtotal}
										/>
									</div>
									<div className='flex flex-row items-center justify-between gap-2'>
										<Label
											className='text-gray-500'
											htmlFor='discount'
											value='Descuento'
										/>
										{haveDiscount ? (
											<TextInput
												className='w-7 flex-auto [appearance:textfield]'
												name='discount'
												placeholder='Importe'
												sizing='sm'
												type='number'
												min='0'
												onChange={onChangeDiscount}
											/>
										) : (
											<button
												className='text-sm font-medium text-blue-700'
												onClick={onAddDiscount}>
												Añadir
											</button>
										)}
									</div>
								</div>
								<div className='flex flex-col gap-4 pb-8'>
									<div className='flex flex-row items-center justify-between gap-2'>
										<Label
											className='text-gray-500'
											htmlFor='otherimport'
											value='Otro importe'
										/>
										{haveOtherImport ? (
											<TextInput
												className='flex-auto [appearance:textfield]'
												name='otherImport'
												sizing='sm'
												placeholder='Importe'
												type='number'
												min='0'
												onChange={onChangeOtherImport}
											/>
										) : (
											<button
												className='text-sm font-medium text-blue-700'
												onClick={onAddOtherImport}>
												Añadir
											</button>
										)}
									</div>
									<div className='flex flex-row justify-between'>
										<Label
											className='font-bold'
											htmlFor='total'
											value='Total'
										/>
										<Label
											className='font-bold'
											name='total'
											value={`$ ${invoice.total}`}
										/>
									</div>
								</div>
							</article>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}

export default Invoices;
