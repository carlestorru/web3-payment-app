import { Card, Badge } from 'flowbite-react';
import { ArrowDown, ArrowUp } from '../../components/Icons/Outlined/Arrow';

export function MarketCards({ data }) {
	return (
		<section className='col-span-8 max-sm:col-span-8 flex flex-wrap justify-center gap-4 pt-4 md:flex-row md:flex-nowrap md:justify-start md:overflow-auto text-black dark:text-white'>
			{data.map((el) => (
				<article key={el.id}>
					<Card className='w-72'>
						<div className='flex flex-row items-center gap-2 border-b-[1px] border-b-slate-300'>
							<img className='h-6 w-6' src={el.image} alt={el.name} />
							<h5 className='text-xl font-bold text-gray-900 dark:text-gray-100'>{el.name}</h5>
						</div>
						<div className='flex flex-row gap-2'>
							<p className='font-semibold'>
								<span className='font-normal text-slate-500 dark:text-slate-200'>Símbolo: </span>
								{el.symbol}
							</p>
							{el.changePercent24Hr < 0 ? (
								<Badge color='failure' icon={ArrowDown}>
									{el.changePercent24Hr} %
								</Badge>
							) : (
								<Badge color='success' icon={ArrowUp}>
									{el.changePercent24Hr} %
								</Badge>
							)}
						</div>
						<p className='font-semibold'>
							<span className='font-normal text-slate-500 dark:text-slate-200'>Activo total: </span>
							{el.marketCapUsd}
						</p>
						<p className='border-t-[1px] border-b-slate-300 pt-2 font-semibold'>
							<span className='font-normal text-slate-500 dark:text-slate-200'>Precio: </span>
							{el.price}
						</p>
						<button className='rounded-md bg-blue-700 hover:bg-opacity-90 hover:font-medium px-1 py-2 text-white'>
							<a href={el.url} target='_blank' rel='noreferrer'>
								Mercado
							</a>
						</button>
					</Card>
				</article>
			))}
		</section>
	);
}
