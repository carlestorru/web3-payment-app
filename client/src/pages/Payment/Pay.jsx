import useAuth from '../../hooks/useAuth';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from 'flowbite-react';
import Logo from '../../assets/3pay_logo/4x/3pay_logo_blue@4x.png'

function Pay() {
	const [product, setProduct] = useState([]);

	useAuth();
	useDocumentTitle('Pay');

	const params = useParams();

	useEffect(() => {
		const getProduct = async () => {
			const response = await fetch(
				`https://fakestoreapi.com/products/${params.productId}`
			);
			const data = await response.json();
			setProduct(data);
		};

		getProduct();
	}, []);

	return (
		<main className='min-h-screen flex-1 overflow-auto bg-slate-100 p-10'>
            <img className='h-18 w-36 m-auto' src={Logo} alt='3pay logo' />
			<h2 className='text-2xl font-bold'>Pago</h2>
			<div>{JSON.stringify(params)}</div>

			<article className='max-w-sm m-auto rounded-lg border border-gray-200 bg-white shadow'>
				<img
					className='rounded-t-lg h-64 m-auto'
					src={product.image}
					alt={product.title}
				/>
				<div className='p-5'>
						<h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900'>
							{product.title}
						</h5>
					<p className='mb-3 font-normal text-gray-700'>
						{product.description}
					</p>
					<h3 className='mb-2 text-xl font-bold tracking-tight text-gray-900'>Precio: {product.price}</h3>
				</div>
			</article>
            <div className='flex justify-center gap-6 mt-6'>
                <Button className='w-36' size='lg'>Aceptar</Button>
                <Button className='w-36' size='lg' color='failure' outline={true}>Cancelar</Button>
            </div>
		</main>
	);
}

export default Pay;
