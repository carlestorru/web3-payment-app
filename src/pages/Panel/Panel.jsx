// import { useQuery } from 'react-query';
import useAuth from '../../hooks/useAuth';
import useDocumentTitle from '../../hooks/useDocumentTitle';
// import getMarketAssets from '../../services/getMarketAssets';
import { Aside } from './Aside';
import { LastOrders } from './LastOrders';
// import { MarketCards } from './MarketCards';

function Panel() {
	useAuth();
	useDocumentTitle('Panel');
	// const { data, isLoading, isError } = useQuery('assets', getMarketAssets);

	return (
		<>
			<h2 className='text-2xl font-bold'>Panel</h2>
			<h4 className='text-slate-500'>
				Visión general de los mercados y últimos pedidos
			</h4>
			<div className='grid grid-cols-8 gap-8'>
				{/*
				{isLoading ? <p>Cargando</p> :  <MarketCards data={data} /> }
				{isError ? <p>Error</p> : ''}
				*/}

				<LastOrders />
				<Aside />
			</div>
		</>
	);
}

export default Panel;
