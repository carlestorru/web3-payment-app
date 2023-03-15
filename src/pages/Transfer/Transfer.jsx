import useAuth from '../../hooks/useAuth';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { Label, TextInput, Button, Select, Radio } from 'flowbite-react';

function Transfer() {
	useAuth();
	useDocumentTitle('Transfer');

	const onSubmit = (event) => {
		event.preventDefault();
		const fields = Object.fromEntries(new window.FormData(event.target))
		console.log(fields)
	};

	return (
		<>
			<h2 className='text-2xl font-bold'>Enviar y solicitar</h2>
			<h4 className='text-slate-500'>
				Recibe y transfiere dinero a otras cuentas
			</h4>
			<section className='flex justify-center pt-4'>
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
						<fieldset className='flex flex-row gap-4' id='radio'>
							<div className='flex items-center gap-2'>
								<Radio
									id='send'
									name='actions'
									value='Send'
									defaultChecked={true}
								/>
								<Label htmlFor='send'>Enviar</Label>
							</div>
							<div className='flex items-center gap-2'>
								<Radio id='recieve' name='actions' value='Recieve' />
								<Label htmlFor='recieve'>Solicitar</Label>
							</div>
						</fieldset>
					</div>

					<div>
						<div>
							<Label htmlFor='message' value='¿Para que es este pago?' />
						</div>
						<TextInput id='message' name='message' type='text' sizing='lg' />
					</div>
					<Button type='submit' fullSized={true}>Enviar</Button>
				</form>
			</section>
		</>
	);
}

export default Transfer;
