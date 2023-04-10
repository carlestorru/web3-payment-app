import useAuth from '../../hooks/useAuth';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from 'flowbite-react';
import Logo from '../../assets/3pay_logo/4x/3pay_logo_blue@4x.png';
import { useWeb3React } from '@web3-react/core';

function Pay() {
	const { library: web3 } = useWeb3React();
	const [product, setProduct] = useState([]);
	const [gasPrice, setGasPrice] = useState(0);

	useAuth();
	useDocumentTitle('Pay');

	const params = useParams();

	useEffect(() => {
		if (web3 !== undefined) {
			web3.eth.getGasPrice().then((result) => {
				setGasPrice(web3.utils.fromWei(result, 'ether'));
			});
		}

		const getProduct = async () => {
			const response = await fetch(
				`https://fakestoreapi.com/products/${params.productId}`
			);
			const data = await response.json();
			setProduct(data);
			console.log(product);
		};

		getProduct();
	}, [web3]);

	return (
		<main className='min-h-screen flex-1 overflow-auto bg-slate-100 p-10'>
			<img className='h-18 m-auto w-36' src={Logo} alt='3pay logo' />
			<h2 className='text-2xl font-bold'>Pago</h2>
			<div>{JSON.stringify(params)}</div>

			<section>
				<div className='mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8'>
					<div className='mx-auto max-w-3xl'>
						<header className='text-center'>
							<h1 className='text-xl font-bold text-gray-900 sm:text-3xl'>
								Tu compra
							</h1>
						</header>

						<div className='mt-8'>
							<ul className='space-y-4'>
								<li className='flex items-center gap-4'>
									<img
										src={product.image}
										alt={product.title}
										className='h-16 w-16 rounded'
									/>

									<div>
										<h3 className='text-base text-gray-900'>{product.title}</h3>

										<dl className='mt-0.5 space-y-px text-sm text-gray-600'>
											<div>
												<dt className='inline'>Price:</dt>
												<dd className='inline font-medium'>
													{' '}
													$ {product.price}
												</dd>
											</div>
										</dl>
									</div>

									<div className='flex flex-1 items-center justify-end gap-2'>
										<form>
											<label htmlFor='Line1Qty' className='sr-only'>
												{' '}
												Quantity{' '}
											</label>

											<input
												type='number'
												min='1'
												value='1'
												id='Line1Qty'
												className='h-8 w-12 rounded border-gray-200 bg-gray-50 p-0 text-center text-xs text-gray-600 [-moz-appearance:_textfield] focus:outline-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none'
											/>
										</form>

										<button className='text-gray-600 transition hover:text-red-600'>
											<span className='sr-only'>Remove item</span>

											<svg
												xmlns='http://www.w3.org/2000/svg'
												fill='none'
												viewBox='0 0 24 24'
												strokeWidth='1.5'
												stroke='currentColor'
												className='h-4 w-4'>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
												/>
											</svg>
										</button>
									</div>
								</li>
							</ul>

							<div className='mt-8 flex justify-center border-t border-gray-100 pt-8'>
								<div className='w-screen max-w-lg space-y-8'>
									<dl className='space-y-0.5 text-sm text-gray-700'>
										<div className='flex justify-between'>
											<dt>Subtotal</dt>
											<dd>£250</dd>
										</div>

										<div className='flex justify-between'>
											<dt>Gas Fee</dt>
											<dd>{gasPrice} ETH</dd>
										</div>

										<div className='flex justify-between !text-base font-medium'>
											<dt>Total</dt>
											<dd>£200</dd>
										</div>
									</dl>

									<div className='flex justify-center gap-6'>
										<Button className='w-32'>Aceptar</Button>
										<Button className='w-32' color='failure' outline={true}>
											Cancelar
										</Button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}

export default Pay;
