import { useEffect, useId, useState } from 'react';
import { CartIcon, ClearCartIcon } from './Icons';

import './Cart.css';
import { useCart } from '../hooks/useCart';
import { Provider3pay } from './Provider3pay';

function CartItem({ thumbnail, price, title, quantity, addToCard }) {
	return (
		<li>
			<img src={thumbnail} alt={title} />
			<div>
				<strong>{title}</strong> - ${price}
			</div>

			<footer>
				<small>Qty: {quantity}</small>
				<button style={{ color: 'white' }} onClick={addToCard}>
					+
				</button>
			</footer>
		</li>
	);
}

export function Cart() {
	const cartCheckboxId = useId();
	const { cart, clearCart, addToCart } = useCart();
	const [totalCart, setTotalCart] = useState(0);

	useEffect(() => {
		if (cart.length > 0) {
			let total = 0;
			cart.forEach((item) => {
				total += item.quantity * item.price;
			});
			setTotalCart(total);
		}
	}, [addToCart]);

	return (
		<>
			<label className='cart-button' htmlFor={cartCheckboxId}>
				<CartIcon />
			</label>
			<input id={cartCheckboxId} type='checkbox' hidden />

			<aside className='cart'>
				<ul>
					{cart.map((product) => (
						<CartItem
							key={product.id}
							addToCard={() => addToCart(product)}
							{...product}
						/>
					))}
				</ul>

				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<button style={{ color: 'white' }} onClick={clearCart}>
						<ClearCartIcon />
					</button>

					<Provider3pay totalCart={totalCart} />
				</div>
			</aside>
		</>
	);
}
