export default function Ethereum(props) {
	return (
		<div className='flex flex-col items-center space-x-2 px-4 text-white'>
			<svg
				id='Layer_1'
				className='h-24 w-24'
				xmlns='http://www.w3.org/2000/svg'
				xmlnsXlink='http://www.w3.org/1999/xlink'
				viewBox='0 0 1949.9 1338'
				fill='none'
				{...props}>
				<style>{'.st3{opacity:.45}.st5{opacity:.8}'}</style>
				<g
					style={{
						opacity: 0.6,
					}}>
					<defs>
						<path id='SVGID_1_' d='M720.6 306.4h508.7v266H720.6z' />
					</defs>
					<clipPath id='SVGID_2_'>
						<use xlinkHref='#SVGID_1_' overflow='visible' />
					</clipPath>
					<path
						d='M975 306.4 720.6 422.1 975 572.4l254.3-150.3z'
						style={{
							clipPath: 'url(#SVGID_2_)',
							fill: '#010101',
						}}
					/>
				</g>
				<g className='st3'>
					<defs>
						<path id='SVGID_3_' d='M720.6 0H975v572.4H720.6z' />
					</defs>
					<clipPath id='SVGID_4_'>
						<use xlinkHref='#SVGID_3_' overflow='visible' />
					</clipPath>
					<path
						d='M720.6 422.1 975 572.4V0z'
						style={{
							clipPath: 'url(#SVGID_4_)',
							fill: '#010101',
						}}
					/>
				</g>
				<g className='st5'>
					<defs>
						<path id='SVGID_5_' d='M975 0h254.4v572.4H975z' />
					</defs>
					<clipPath id='SVGID_6_'>
						<use xlinkHref='#SVGID_5_' overflow='visible' />
					</clipPath>
					<path
						d='M975 0v572.4l254.3-150.3z'
						style={{
							clipPath: 'url(#SVGID_6_)',
							fill: '#010101',
						}}
					/>
				</g>
				<g className='st3'>
					<defs>
						<path id='SVGID_7_' d='M720.6 470.3H975v358.4H720.6z' />
					</defs>
					<clipPath id='SVGID_8_'>
						<use xlinkHref='#SVGID_7_' overflow='visible' />
					</clipPath>
					<path
						d='M720.6 470.3 975 828.7V620.6z'
						style={{
							clipPath: 'url(#SVGID_8_)',
							fill: '#010101',
						}}
					/>
				</g>
				<g className='st5'>
					<defs>
						<path id='SVGID_9_' d='M975 470.3h254.5v358.4H975z' />
					</defs>
					<clipPath id='SVGID_10_'>
						<use xlinkHref='#SVGID_9_' overflow='visible' />
					</clipPath>
					<path
						d='M975 620.6v208.1l254.5-358.4z'
						style={{
							clipPath: 'url(#SVGID_10_)',
							fill: '#010101',
						}}
					/>
				</g>
			</svg>
			<span className='text-2xl font-extrabold'>Ethereum</span>
		</div>
	);
}
