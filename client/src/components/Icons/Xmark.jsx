export function Xmark({ stroke, size }) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			fill='none'
			viewBox='0 0 24 24'
			strokeWidth={stroke}
			stroke='currentColor'
			className={size}>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				d='M6 18L18 6M6 6l12 12'
			/>
		</svg>
	);
}
