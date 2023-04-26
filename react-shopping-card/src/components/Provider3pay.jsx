import { useState } from 'react';
import threePayLogo from '../assets/3pay_logo_white@4x.png';

import './Provider3pay.css';

export function Provider3pay({ totalCart }) {
	const [showToast, setShowToast] = useState(false);
	const [txHash, setTxHash] = useState(null);

	const pay = () => {
		window.addEventListener('message', function (event) {
			if (event.origin !== 'http://localhost:3000') return;
			const response = event.data;
			setTxHash(response);
			setShowToast(true);
			setTimeout(() => setShowToast(false), 8000);
			console.log(response);
		});
	};
	return (
		<>
			{showToast ? (
				<div className='toast'>
					<p>
						{' '}
						<span style={{fontWeight: 'bold'}}>Pago realizado con éxito! </span>
						<br></br>Id de la transacción: {txHash}
					</p>
				</div>
			) : (
				''
			)}

			<button id='threepaybtn' onClick={pay}>
				<a href={`http://localhost:3000/pay/reactshop/${totalCart}`} target='blank'>
					<div>
						Pagar con <img src={threePayLogo} alt='3pay logo' />
					</div>
				</a>
			</button>
		</>
	);
}
