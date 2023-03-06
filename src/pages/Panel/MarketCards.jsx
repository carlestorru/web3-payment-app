import { Card, Badge } from 'flowbite-react';
import { ArrowDown, ArrowUp } from '../../components/Icons/Outlined/Arrow';

export function MarketCards({ limit, data }) {
	return (
		<section className='col-span-2 row-span-1 flex flex-wrap justify-center gap-4 pt-4 md:flex-row md:flex-nowrap md:justify-start md:overflow-auto'>
			{data.slice(0, limit).map((el) => (
				<article key={el.id}>
					<Card className='w-64'>
						<h5 className='border-b-[1px] border-b-slate-300 text-xl font-bold text-gray-900'>
							{el.name}
						</h5>
						<div className='flex flex-row gap-2'>
							<p className='font-semibold'>
								<span className='font-normal text-slate-500'>Símbolo: </span>
								{el.symbol}
							</p>
							{el.changePercent24Hr < 0 ? (
								<Badge color='failure' icon={ArrowDown}>
									{Number(el.changePercent24Hr, 2).toFixed(2)} %
								</Badge>
							) : (
								<Badge color='success' icon={ArrowUp}>
									{Number(el.changePercent24Hr, 2).toFixed(2)} %
								</Badge>
							)}
						</div>
						<p className='font-semibold'>
							<span className='font-normal text-slate-500'>Activo total: </span>
							$ {Math.round(el.marketCapUsd* 100) / 100}
						</p>
						<p className='pt-2 font-semibold border-t-[1px] border-b-slate-300'>
							<span className='font-normal text-slate-500'>Precio: </span>${' '}
							{Math.round(el.priceUsd * 100) / 100}
						</p>
						<button className='rounded-md bg-blue-500 px-1 py-2 text-white'>
                            <a href={el.explorer} target='_blank' rel='noreferrer'>Mercado</a>
						</button>
					</Card>
				</article>
			))}
		</section>
	);
}
