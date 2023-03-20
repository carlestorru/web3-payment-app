import useAuth from '../../hooks/useAuth';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { Label, TextInput, Button, Select, Tabs } from 'flowbite-react';
import { useWeb3React } from '@web3-react/core';

function Transfer() {
	const { account, library: web3 } = useWeb3React();
	useAuth();
	useDocumentTitle('Transfer');

	const onSubmit = async (event) => {
		event.preventDefault();
		const fields = Object.fromEntries(new window.FormData(event.target));
		console.log(fields);
		const nonce = await web3.eth.getTransactionCount(account, 'latest');

		const value = web3.utils.toWei(fields.quantity);

		const transaction = {
			from: account,
			to: fields.address, // faucet address to return eth
			value: value,
			nonce: nonce,
			data: web3.utils.toHex(fields.message),
		};

		const signedTx = await web3.eth.sendTransaction(
			transaction,
			function (error, hash) {
				if (!error) {
					console.log('🎉 The hash of your transaction is: ', hash);
				} else {
					console.log(
						'❗Something went wrong while submitting your transaction:',
						error
					);
				}
			}
		);

		console.log(signedTx)
	};

	return (
		<>
			<h2 className='text-2xl font-bold'>Enviar y solicitar</h2>
			<h4 className='text-slate-500'>
				Recibe y transfiere dinero a otras cuentas
			</h4>
			<section className='m-auto w-full pt-4 lg:w-3/5'>
				<Tabs.Group
					className='flex justify-center'
					aria-label='Tabs with underline'
					style='underline'>
					<Tabs.Item active={true} title='Enviar'>
						<form
							className='flex flex-col content-center justify-center gap-4'
							onSubmit={onSubmit}>
							<div>
								<Label htmlFor='address' value='Wallet' />
								<TextInput
									id='address'
									name='address'
									placeholder='Introduce una dirección wallet...'
									required={true}
									addon='0x'
								/>
							</div>

							<div className='flex flex-row justify-between'>
								<div>
									<div>
										<Label htmlFor='quantity' value='Cantidad' />
									</div>
									<div className='flex flex-row'>
										<TextInput
											id='quantity'
											name='quantity'
											placeholder='Cantidad...'
											required={true}
										/>
										<Select name='currency' id='currencies' required={true}>
											<option>ETH</option>
											<option>$</option>
										</Select>
									</div>
								</div>
							</div>

							<div>
								<div>
									<Label htmlFor='message' value='¿Para que es este pago?' />
								</div>
								<TextInput
									id='message'
									name='message'
									type='text'
									sizing='lg'
								/>
							</div>
							<Button type='submit' fullSized={true}>
								Enviar
							</Button>
						</form>
					</Tabs.Item>
					<Tabs.Item title='Solicitar'>Solicitar</Tabs.Item>
				</Tabs.Group>
			</section>
		</>
	);
}

export default Transfer;
