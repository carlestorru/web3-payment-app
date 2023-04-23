import useAuth from '../../hooks/useAuth';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { Label, TextInput, Button, Textarea } from 'flowbite-react';
import { useState } from 'react';
import getUsername from '../../services/getUsername';
import { Xmark } from '../../components/Icons/Xmark';
import Datepicker from 'tailwind-datepicker-react';

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
	datepickerClassNames: '',
	defaultDate: '',
	language: 'es',
};

function Invoices() {
	useAuth();
	useDocumentTitle('Facturas');
	const [timer, setTimer] = useState(null);
	const [userResults, setUserResults] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);
	const [articles, setArticles] = useState([]);
	const [showDatePicker, setShowDatePicker] = useState(false);

	const onSubmit = (event) => {
		event.preventDefault();
		const fields = Object.fromEntries(new window.FormData(event.target));
		console.log(fields);
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
		} else {
			setUserResults([]);
		}
	};

	const selectUser = (user, action) => {
		if (action === 'send') {
			document.getElementById('addressSend').value = user.hash;
		} else if (action === 'request') {
			document.getElementById('addressRequest').value = user.hash;
		}
		setSelectedUser(user);
	};

	const addArticle = (event) => {
		event.preventDefault();
		const fields = Object.fromEntries(new window.FormData(event.target));
		setArticles((prev) => [...prev].concat(fields));
	};

	const deleteArticle = (index) => {
		setArticles((prev) => {
			return [...prev.slice(0, index), ...prev.slice(index + 1)];
		});
	};

	const handleChangeDate = (selectedDate) => {
		const timestamp = new Date(selectedDate / 1000).getTime();
		console.log(timestamp);
	};

	const handleCloseDatePicker = (state) => {
		setShowDatePicker(state);
	};

	return (
		<>
			<h2 className='text-2xl font-bold dark:text-white'>Facturas</h2>
			<h4 className='text-slate-500 dark:text-slate-200'>
				Crea y consulta tus facturas
			</h4>

			<section className='mt-4 flex flex-col'>
				<div>
					<div className='flex flex-col gap-4'>
						<article className='flex flex-row justify-between'>
							<h6 className='text-xl font-semibold'>Nueva factura</h6>
							<Button onClick={onSubmit}>Enviar</Button>
						</article>
						<div className='flex flex-col gap-8 lg:grid lg:grid-cols-4'>
							<article className='col-span-3 flex flex-col content-center justify-center gap-8 rounded-lg border border-gray-300 bg-white p-4 shadow-sm'>
								<div>
									<div className='mb-2 block'>
										<Label className='font-bold' htmlFor='address' value='Factura para' />
									</div>
									<TextInput
										id='addressSend'
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
															onClick={() => selectUser(el, 'send')}>
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
									{articles.length !== 0
										? articles.map((el, index) => (
												<div key={el.article} className='flex flex-row gap-1'>
													<div className='flex-1 rounded-lg border border-gray-300 p-4'>
														<div className='flex flex-row gap-2 max-md:flex-col'>
															<TextInput
																className='flex-auto'
																name='article'
																defaultValue={el.article}
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
															Importe {el.quantity * el.price}
														</p>
													</div>
													<button onClick={() => deleteArticle(index)}>
														<Xmark stroke='2.5' size='h-4 w-4' />
													</button>
												</div>
										  ))
										: ''}
									<form onSubmit={addArticle}>
										<div className='rounded-lg border border-gray-300 p-4'>
											<div className='flex flex-row gap-2 max-md:flex-col'>
												<TextInput
													className='flex-auto'
													type='text'
													name='article'
													placeholder='Nombre del artículo'
													required={true}
												/>
												<div className='flex flex-1 flex-row gap-2'>
													<TextInput
														className='flex-auto [appearance:textfield]'
														name='quantity'
														placeholder='Cantidad'
														type='number'
														required={true}
													/>
													<TextInput
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
												className='mt-2 text-sm'
												name='description'
												placeholder='Descripción (opcional)'
												rows={3}
											/>
											<p className='mt-2 text-right text-xs font-bold'>
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
										<Label className='font-bold' htmlFor='message' value='Mensaje para el cliente' />
									</div>
									<Textarea
										id='message'
										name='message'
										placeholder='Escribe un mensaje...'
										rows={3}
									/>
								</div>
							</article>
							<article className='col-span-1 flex h-fit flex-col content-center justify-start gap-4 rounded-lg border border-gray-300 bg-white p-4 shadow-sm'>
								<div className='border-b border-b-slate-300 pb-4'>
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
								<div className='flex flex-col gap-4 border-b border-b-slate-300 pb-4'>
									<div className='flex flex-row justify-between'>
										<Label className='text-gray-500' htmlFor='subtotal' value='Subtotal' />
										<Label className='text-gray-500' htmlFor='subtotal' value='$ 0,00' />
									</div>
									<div className='flex flex-row justify-between'>
										<Label className='text-gray-500' htmlFor='discount' value='Descuento' />
										<button className='text-sm font-medium text-blue-700'>
											Añadir
										</button>
									</div>
								</div>
								<div className='flex flex-col gap-4 border-b border-b-slate-300 pb-4'>
									<div className='flex flex-row justify-between'>
										<Label className='text-gray-500' htmlFor='subtotal' value='Subtotal' />
										<Label className='text-gray-500' name='subtotal' value='$ 0,00' />
									</div>
									<div className='flex flex-row justify-between'>
										<Label className='text-gray-500' htmlFor='discount' value='Descuento' />
										<button className='text-sm font-medium text-blue-700'>
											Añadir
										</button>
									</div>
								</div>
								<div className='flex flex-col gap-4 pb-8'>
									<div className='flex flex-row justify-between'>
										<Label className='font-bold' htmlFor='total' value='Total' />
										<Label className='font-bold' name='total' value='$ 0,00' />
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
