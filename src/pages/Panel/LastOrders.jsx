import { Table } from 'flowbite-react';

export function LastOrders() {
	return (
		<section className='col-span-2 row-span-1 flex flex-col gap-4 '>
			<h3 className='text-xl font-bold'>Últimos pedidos</h3>
			<Table hoverable={true}>
				<Table.Head>
					<Table.HeadCell>ID. transacción</Table.HeadCell>
					<Table.HeadCell>Producto</Table.HeadCell>
					<Table.HeadCell>Categoria</Table.HeadCell>
					<Table.HeadCell>Precio</Table.HeadCell>
					<Table.HeadCell>
						<span className='sr-only'>Edit</span>
					</Table.HeadCell>
				</Table.Head>
				<Table.Body className='divide-y'>
					<Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
						<Table.Cell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
							Apple MacBook Pro 17
						</Table.Cell>
						<Table.Cell>Sliver</Table.Cell>
						<Table.Cell>Laptop</Table.Cell>
						<Table.Cell>$2999</Table.Cell>
						<Table.Cell>
							<a
								href='/tables'
								className='font-medium text-blue-600 hover:underline dark:text-blue-500'>
								Edit
							</a>
						</Table.Cell>
					</Table.Row>
					<Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
						<Table.Cell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
							Microsoft Surface Pro
						</Table.Cell>
						<Table.Cell>White</Table.Cell>
						<Table.Cell>Laptop PC</Table.Cell>
						<Table.Cell>$1999</Table.Cell>
						<Table.Cell>
							<a
								href='/tables'
								className='font-medium text-blue-600 hover:underline dark:text-blue-500'>
								Edit
							</a>
						</Table.Cell>
					</Table.Row>
					<Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
						<Table.Cell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
							Magic Mouse 2
						</Table.Cell>
						<Table.Cell>Black</Table.Cell>
						<Table.Cell>Accessories</Table.Cell>
						<Table.Cell>$99</Table.Cell>
						<Table.Cell>
							<a
								href='/tables'
								className='font-medium text-blue-600 hover:underline dark:text-blue-500'>
								Edit
							</a>
						</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table>
		</section>
	);
}
