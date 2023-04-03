import {
	ArrowDownLeft,
	ArrowUpRight,
} from '../../components/Icons/Outlined/Arrow';

export function Aside() {
	return (
		<aside className='col-start-8 row-start-1 flex flex-col justify-start items-center max-sm:hidden'>
			<section className='flex flex-col justify-center gap-4'>
				<h4></h4>
				<article className='flex flex-col items-center'>
					<button className='h-12 w-12 rounded-full bg-blue-500 hover:bg-opacity-90 p-3 text-white'>
						<ArrowUpRight />
					</button>
					<h5 className='text-center text-black text-sm font-medium'>Enviar</h5>
				</article>
				<article className='flex flex-col items-center'>
					<button className='h-12 w-12 rounded-full bg-blue-500 hover:bg-opacity-90 p-3 text-white'>
						<ArrowDownLeft />
					</button>
					<h5 className='text-center text-black text-sm font-medium'>Solicitar</h5>
				</article>
			</section>
		</aside>
	);
}
